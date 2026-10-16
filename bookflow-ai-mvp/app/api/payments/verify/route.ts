import { NextRequest, NextResponse } from 'next/server';
import { verifyDepositPayment, PaymentProvider } from '@/lib/payments';
import { createAdminSupabase, hasSupabaseConfig } from '@/lib/supabase-admin';
import { sendEnquiryNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      provider = 'razorpay',
      orderId,
      paymentId,
      signature,
      artistId,
      depositAmount = 2500,
      totalAmount = 0,
      customerName,
      customerPhone,
      customerEmail = '',
      serviceName,
      eventDate,
      notes = ''
    } = body;

    if (!orderId || !paymentId || !artistId || !customerName || !customerPhone) {
      return NextResponse.json({ error: 'Missing required payment verification details.' }, { status: 400 });
    }

    const verification = verifyDepositPayment({
      provider: provider as PaymentProvider,
      orderId,
      paymentId,
      signature,
      artistId,
      depositAmount: Number(depositAmount),
      customerName,
      customerPhone,
      customerEmail,
      serviceName,
      eventDate
    });

    if (!verification.verified) {
      return NextResponse.json({ error: verification.error || 'Payment verification failed.' }, { status: 400 });
    }

    const tokenNumber = Math.floor(100000 + Math.random() * 900000);
    const receiptToken = `BKF-DEP-${tokenNumber}`;
    const paidAt = new Date().toISOString();
    const cleanDeposit = Number(depositAmount);
    const cleanTotal = Number(totalAmount) || cleanDeposit * 2;
    const remainingBalance = Math.max(0, cleanTotal - cleanDeposit);

    let artistBusinessName = 'Bridal Makeup Artist';
    let artistPhone = '919623463854';
    let artistArea = '';
    let artistCity = '';

    if (hasSupabaseConfig()) {
      const db = createAdminSupabase();

      // 1. Fetch artist details
      const { data: artist } = await db
        .from('artists')
        .select('id, business_name, city, area, address_public')
        .eq('id', artistId)
        .maybeSingle();

      if (artist) {
        artistBusinessName = artist.business_name;
        artistArea = artist.area;
        artistCity = artist.city;

        let meta: Record<string, any> = {};
        try {
          meta = JSON.parse(artist.address_public || '{}');
        } catch {
          meta = {};
        }

        artistPhone = meta.whatsapp || '919623463854';

        // 2. Insert into enquiries table with 'booked' status
        const depositReceipt = {
          token: receiptToken,
          provider,
          orderId,
          paymentId,
          depositAmount: cleanDeposit,
          remainingBalance,
          totalAmount: cleanTotal,
          paidAt,
          notes
        };

        const { data: enquiry, error: enqError } = await db
          .from('enquiries')
          .insert({
            customer_name: customerName,
            customer_phone: customerPhone,
            service_name: serviceName,
            event_date: eventDate,
            event_area: artistArea || 'Main Venue',
            event_city: artistCity || 'Studio',
            budget: cleanTotal,
            notes: `[DEPOSIT PAID: ₹${cleanDeposit.toLocaleString('en-IN')} via ${provider.toUpperCase()}] Receipt: ${receiptToken}. Customer notes: ${notes}`,
            status: 'booked'
          })
          .select('id')
          .single();

        if (!enqError && enquiry) {
          // 3. Insert enquiry offer marked 'accepted'
          await db.from('enquiry_offers').insert({
            enquiry_id: enquiry.id,
            artist_id: artist.id,
            distance_km: 0,
            offer_order: 1,
            status: 'accepted',
            responded_at: paidAt
          });
        }

        // 4. Update artist's persistent deposits record and analytics
        const existingDeposits = Array.isArray(meta.deposits) ? meta.deposits : [];
        const newDepositRecord = {
          id: `dep_${Date.now()}`,
          token: receiptToken,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          service_name: serviceName,
          event_date: eventDate,
          deposit_amount: cleanDeposit,
          remaining_balance: remainingBalance,
          provider,
          payment_id: paymentId,
          paid_at: paidAt,
          status: 'confirmed'
        };

        const existingAnalytics = meta.analytics || {
          views: 120,
          whatsapp_clicks: 34,
          enquiries: 14,
          advance_deposits_count: 0,
          advance_deposits_amount: 0
        };

        meta.deposits = [newDepositRecord, ...existingDeposits];
        meta.analytics = {
          ...existingAnalytics,
          advance_deposits_count: (existingAnalytics.advance_deposits_count || 0) + 1,
          advance_deposits_amount: (existingAnalytics.advance_deposits_amount || 0) + cleanDeposit
        };

        await db
          .from('artists')
          .update({ address_public: JSON.stringify(meta) })
          .eq('id', artist.id);
      }
    }

    // 5. Generate luxury WhatsApp confirmation URL
    const cleanWaNumber = artistPhone.replace(/[^\d]/g, '');
    const waPhone = cleanWaNumber.length === 10 ? '91' + cleanWaNumber : cleanWaNumber;
    const confirmationText = `🎉 *BOOKING DEPOSIT CONFIRMED!*
Token: *#${receiptToken}*
Artist: *${artistBusinessName}*
Client: *${customerName}* (${customerPhone})
Service: *${serviceName}*
Event Date: *${eventDate}*
Deposit Paid: *₹${cleanDeposit.toLocaleString('en-IN')}* via ${provider.toUpperCase()}
Remaining Balance: *₹${remainingBalance.toLocaleString('en-IN')}* (due at event)
Ref ID: \`${paymentId}\`

Hi ${artistBusinessName}, my advance booking deposit is paid! Looking forward to confirming further glam details.`;

    const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(confirmationText)}`;

    // 6. Send email notification asynchronously
    sendEnquiryNotification({
      artistName: artistBusinessName,
      customerName,
      customerPhone,
      serviceName: `${serviceName} (DEPOSIT CONFIRMED: ₹${cleanDeposit.toLocaleString('en-IN')})`,
      eventDate,
      eventArea: artistArea,
      eventCity: artistCity,
      budget: cleanTotal,
      notes: `Advance deposit of ₹${cleanDeposit} verified via ${provider.toUpperCase()} (Ref: ${paymentId}). Token: ${receiptToken}`,
      artistPhone: waPhone
    }).catch((err: any) => console.error('Notification dispatch error:', err));

    return NextResponse.json({
      ok: true,
      receiptToken,
      paidAt,
      depositAmount: cleanDeposit,
      remainingBalance,
      whatsappUrl,
      paymentId,
      provider
    });
  } catch (e: any) {
    console.error('Error verifying advance deposit payment:', e);
    return NextResponse.json({ error: e.message || 'Payment verification failed.' }, { status: 500 });
  }
}
