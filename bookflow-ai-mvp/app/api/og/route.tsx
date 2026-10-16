import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'BookFlow Beauty';
    const subtitle = searchParams.get('subtitle') || 'Couture Bridal & Destination Makeup Artists Worldwide';
    const location = searchParams.get('location') || 'Worldwide';
    const price = searchParams.get('price');
    const rating = searchParams.get('rating') || '5.0';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #2b0819 0%, #43122b 50%, #1a050f 100%)',
            color: '#ffffff',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            position: 'relative'
          }}
        >
          {/* Subtle gold glow */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 163, 89, 0.28) 0%, transparent 70%)'
            }}
          />

          {/* Top Brand Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #d4a359 0%, #b88636 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '22px'
                }}
              >
                ✦
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  bookflow<span style={{ color: '#d4a359' }}>.beauty</span>
                </span>
                <span style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#e8a598', textTransform: 'uppercase' }}>
                  Luxury Bridal & Couture Directory
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(212, 163, 89, 0.4)',
                borderRadius: '99px',
                padding: '8px 18px',
                fontSize: '14px',
                color: '#faedf2',
                fontWeight: 600
              }}
            >
              <span>📍 {location}</span>
            </div>
          </div>

          {/* Center Card Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: 'auto 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: 'rgba(212, 163, 89, 0.2)',
                  border: '1px solid #d4a359',
                  color: '#fbe2a7',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  padding: '5px 14px',
                  borderRadius: '99px',
                  textTransform: 'uppercase'
                }}
              >
                100% Verified Artist
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffd700',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: '99px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ★ {rating} (Verified Reviews)
              </div>
            </div>

            <h1
              style={{
                fontSize: '54px',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: 0,
                maxWidth: '920px',
                textShadow: '0 4px 18px rgba(0,0,0,0.4)'
              }}
            >
              {title}
            </h1>

            <p style={{ fontSize: '20px', color: '#faedf2', margin: 0, maxWidth: '820px', lineHeight: 1.5, opacity: 0.9 }}>
              {subtitle}
            </p>
          </div>

          {/* Bottom Bar: Pricing & 1-Click WhatsApp CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(236, 221, 228, 0.2)',
              paddingTop: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {price && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#e8a598', textTransform: 'uppercase' }}>
                    Starting From
                  </span>
                  <span style={{ fontSize: '26px', fontWeight: 800, color: '#fbe2a7' }}>
                    {price}
                  </span>
                </div>
              )}
              <span style={{ fontSize: '14px', color: '#faedf2', opacity: 0.85 }}>
                Direct WhatsApp Booking • Before & After Lookbook • No Middleman Fees
              </span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '99px',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)'
              }}
            >
              💬 1-Click WhatsApp Direct
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
