export interface EnquiryNotificationPayload {
  customerName: string;
  customerPhone: string;
  serviceName: string;
  eventDate: string;
  eventArea: string;
  eventCity: string;
  budget?: number | null;
  notes?: string;
  artistName?: string;
  artistPhone?: string;
  artistEmail?: string;
}

export interface NotificationResult {
  whatsappUrl: string;
  emailSent: boolean;
  webhookSent: boolean;
  message: string;
}

/**
 * Creates a pre-filled direct WhatsApp message for the artist/client.
 */
export function buildWhatsAppLink(phone: string, payload: EnquiryNotificationPayload): string {
  const cleanPhone = (phone || '').replace(/\D/g, '');
  if (!cleanPhone) return '';

  const formattedPhone = cleanPhone.startsWith('91') || cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`;

  const lines = [
    `✨ *New Booking Enquiry from BookFlow Beauty!*`,
    ``,
    `👰 *Client:* ${payload.customerName}`,
    `📞 *Client Phone:* ${payload.customerPhone}`,
    `💄 *Service:* ${payload.serviceName}`,
    `📅 *Event Date:* ${payload.eventDate}`,
    `📍 *Location:* ${payload.eventArea}, ${payload.eventCity}`,
    payload.budget ? `💰 *Budget:* ₹${payload.budget.toLocaleString('en-IN')}` : `💰 *Budget:* Flexible`,
    payload.notes ? `📝 *Client Notes:* ${payload.notes}` : '',
    ``,
    `_Sent via BookFlow Beauty Verified Directory (https://neel-repotech.vercel.app)_`
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${formattedPhone}?text=${text}`;
}

/**
 * Dispatches automated notifications via WhatsApp Link, Email (Resend), and Webhook.
 */
export async function sendEnquiryNotification(
  payload: EnquiryNotificationPayload
): Promise<NotificationResult> {
  const whatsappUrl = payload.artistPhone ? buildWhatsAppLink(payload.artistPhone, payload) : '';
  let emailSent = false;
  let webhookSent = false;

  // 1. Send Email Notification via Resend (if RESEND_API_KEY is configured)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && payload.artistEmail) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'BookFlow Beauty <bookings@bookflow.beauty>',
          to: [payload.artistEmail],
          subject: `✨ New Bridal Booking Enquiry: ${payload.customerName} for ${payload.serviceName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ebd2dd; border-radius: 16px; background: #fffcfd;">
              <h2 style="color: #43122b; margin-top: 0;">✨ New Booking Enquiry on BookFlow Beauty</h2>
              <p style="color: #6d6669; font-size: 15px;">You have received a new booking enquiry from a client!</p>
              
              <div style="background: #ffffff; border: 1px solid #ebd2dd; border-radius: 12px; padding: 18px; margin: 20px 0;">
                <p style="margin: 6px 0;"><strong>Client Name:</strong> ${payload.customerName}</p>
                <p style="margin: 6px 0;"><strong>Phone:</strong> <a href="tel:${payload.customerPhone}">${payload.customerPhone}</a></p>
                <p style="margin: 6px 0;"><strong>Service:</strong> ${payload.serviceName}</p>
                <p style="margin: 6px 0;"><strong>Event Date:</strong> ${payload.eventDate}</p>
                <p style="margin: 6px 0;"><strong>Location:</strong> ${payload.eventArea}, ${payload.eventCity}</p>
                <p style="margin: 6px 0;"><strong>Budget:</strong> ${payload.budget ? '₹' + payload.budget : 'Flexible'}</p>
                ${payload.notes ? `<p style="margin: 6px 0;"><strong>Notes:</strong> ${payload.notes}</p>` : ''}
              </div>

              ${whatsappUrl ? `
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${whatsappUrl}" style="background: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 99px; text-decoration: none; font-weight: bold; display: inline-block;">
                    💬 Open in WhatsApp & Reply to Client
                  </a>
                </div>
              ` : ''}

              <p style="font-size: 12px; color: #a49a9e; text-align: center; margin-top: 30px;">
                BookFlow Beauty • Luxury Bridal & Couture Directory
              </p>
            </div>
          `
        })
      });
      emailSent = res.ok;
    } catch (err) {
      console.error('Email dispatch error:', err);
    }
  }

  // 2. Dispatch to custom WhatsApp / CRM Webhook if configured
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      webhookSent = res.ok;
    } catch (err) {
      console.error('Webhook dispatch error:', err);
    }
  }

  return {
    whatsappUrl,
    emailSent,
    webhookSent,
    message: 'Notification configured successfully.'
  };
}
