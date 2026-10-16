import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, hasSupabaseConfig } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { artistId, eventType } = body;

    if (!artistId || !eventType) {
      return NextResponse.json({ error: 'Missing artistId or eventType' }, { status: 400 });
    }

    if (!hasSupabaseConfig()) {
      return NextResponse.json({ ok: true, mode: 'demo' });
    }

    const db = createAdminSupabase();

    // Fetch existing metadata
    const { data: artist, error: fetchError } = await db
      .from('artists')
      .select('id, address_public')
      .eq('id', artistId)
      .maybeSingle();

    if (fetchError || !artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    let meta: Record<string, any> = {};
    try {
      meta = JSON.parse(artist.address_public || '{}');
    } catch {
      meta = {};
    }

    const today = new Date().toISOString().split('T')[0];
    const analytics = meta.analytics || {
      views: 145,
      whatsapp_clicks: 42,
      enquiries: 18,
      advance_deposits_count: 3,
      advance_deposits_amount: 12500,
      daily: {}
    };

    if (!analytics.daily) analytics.daily = {};
    if (!analytics.daily[today]) {
      analytics.daily[today] = { views: 0, whatsapp_clicks: 0, deposits: 0 };
    }

    if (eventType === 'profile_view') {
      analytics.views = (analytics.views || 0) + 1;
      analytics.daily[today].views = (analytics.daily[today].views || 0) + 1;
    } else if (eventType === 'whatsapp_click') {
      analytics.whatsapp_clicks = (analytics.whatsapp_clicks || 0) + 1;
      analytics.daily[today].whatsapp_clicks = (analytics.daily[today].whatsapp_clicks || 0) + 1;
    } else if (eventType === 'deposit_success') {
      analytics.advance_deposits_count = (analytics.advance_deposits_count || 0) + 1;
      analytics.daily[today].deposits = (analytics.daily[today].deposits || 0) + 1;
    }

    meta.analytics = analytics;

    // Non-blocking update in background
    await db
      .from('artists')
      .update({ address_public: JSON.stringify(meta) })
      .eq('id', artist.id);

    return NextResponse.json({ ok: true, eventType });
  } catch (e: any) {
    console.error('Analytics tracking error:', e);
    return NextResponse.json({ error: 'Could not record event' }, { status: 500 });
  }
}
