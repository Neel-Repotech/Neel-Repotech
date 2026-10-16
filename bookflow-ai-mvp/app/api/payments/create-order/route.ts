import { NextRequest, NextResponse } from 'next/server';
import { createDepositOrder } from '@/lib/payments';
import { createAdminSupabase, hasSupabaseConfig } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      artistId,
      serviceName,
      totalServicePrice = 0,
      depositAmount = 2500,
      eventDate,
      customerName,
      customerPhone,
      customerEmail = '',
      provider = 'razorpay'
    } = body;

    if (!artistId || !serviceName || !eventDate || !customerName || !customerPhone) {
      return NextResponse.json({
        error: 'Please fill in your name, contact phone number, event date, and select a service.'
      }, { status: 400 });
    }

    const cleanDeposit = Math.max(500, Number(depositAmount) || 2500);

    // Fetch artist details if Supabase is connected
    let artistName = 'Luxury Bridal Studio';
    if (hasSupabaseConfig()) {
      const db = createAdminSupabase();
      const { data: artist } = await db
        .from('artists')
        .select('business_name')
        .eq('id', artistId)
        .maybeSingle();
      if (artist?.business_name) artistName = artist.business_name;
    }

    const order = await createDepositOrder({
      artistId,
      artistName,
      serviceName,
      totalServicePrice: Number(totalServicePrice) || cleanDeposit * 2,
      depositAmount: cleanDeposit,
      currency: 'INR',
      eventDate,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      provider: provider === 'stripe' ? 'stripe' : 'razorpay'
    });

    return NextResponse.json({
      ok: true,
      ...order,
      artistName
    });
  } catch (e: any) {
    console.error('Error in create-order endpoint:', e);
    return NextResponse.json({ error: e.message || 'Could not initiate advance deposit.' }, { status: 500 });
  }
}
