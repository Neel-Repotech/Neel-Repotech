import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

    const db = createAdminSupabase();
    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Your session expired. Sign in again.' }, { status: 401 });

    const { data: profile } = await db.from('profiles').select('full_name, role, phone').eq('id', user.id).maybeSingle();

    const { data: artist, error } = await db
      .from('artists')
      .select('id, business_name, slug, bio, city, area, starting_price, status, travel_radius_km, address_public, services(id, name, description, price_from, is_active), portfolio_items(id, image_url, caption, sort_order), subscriptions(plan_code, status, ends_at)')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    if (!artist) return NextResponse.json({ error: 'No artist profile found for this account.' }, { status: 404 });

    // Parse address_public if it contains JSON metadata
    let instagram = '';
    let experience = '';
    if (artist.address_public) {
      try {
        const parsed = JSON.parse(artist.address_public);
        instagram = parsed.instagram || '';
        experience = parsed.experience || '';
      } catch {
        // If it's a plain string
        if (artist.address_public.includes('instagram.com') || artist.address_public.startsWith('@')) {
          instagram = artist.address_public;
        }
      }
    }

    const { data: offers, error: offerError } = await db
      .from('enquiry_offers')
      .select('id, status, distance_km, offer_order, offered_at, expires_at, enquiries(id, customer_name, customer_phone, service_name, event_date, event_area, event_city, budget, notes, status, created_at)')
      .eq('artist_id', artist.id)
      .in('status', ['offered', 'accepted', 'declined', 'expired'])
      .order('created_at', { ascending: false })
      .limit(50);

    if (offerError) throw offerError;

    return NextResponse.json({
      artist: {
        ...artist,
        instagram,
        experience,
        portfolio_items: (artist.portfolio_items || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      },
      offers: offers || [],
      email: user.email,
      fullName: profile?.full_name || '',
      role: profile?.role || 'artist'
    });
  } catch (e: any) {
    console.error('Dashboard GET error:', e);
    return NextResponse.json({ error: 'Could not load dashboard data.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

    const db = createAdminSupabase();
    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Your session expired. Sign in again.' }, { status: 401 });

    const { data: artist, error: findError } = await db
      .from('artists')
      .select('id, business_name, address_public')
      .eq('user_id', user.id)
      .maybeSingle();

    if (findError || !artist) return NextResponse.json({ error: 'Artist profile not found.' }, { status: 404 });

    const body = await req.json();

    // 1. Update Artist Profile Info (Bio, Price, Instagram, Experience, Location)
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (typeof body.business_name === 'string' && body.business_name.trim()) {
      updatePayload.business_name = body.business_name.trim();
    }
    if (typeof body.bio === 'string') {
      updatePayload.bio = body.bio.trim();
    }
    if (body.starting_price !== undefined) {
      const price = Number(body.starting_price);
      if (!isNaN(price) && price >= 0) {
        updatePayload.starting_price = Math.round(price);
      }
    }
    if (typeof body.city === 'string' && body.city.trim()) {
      updatePayload.city = body.city.trim();
    }
    if (typeof body.area === 'string' && body.area.trim()) {
      updatePayload.area = body.area.trim();
    }

    // Preserve and update Instagram & Experience metadata in address_public
    let currentMeta: Record<string, any> = {};
    if (artist.address_public) {
      try {
        currentMeta = JSON.parse(artist.address_public);
      } catch {
        currentMeta = {};
      }
    }

    if (body.instagram !== undefined || body.experience !== undefined) {
      if (body.instagram !== undefined) currentMeta.instagram = String(body.instagram).trim();
      if (body.experience !== undefined) currentMeta.experience = String(body.experience).trim();
      updatePayload.address_public = JSON.stringify(currentMeta);
    }

    const { error: artistUpdateError } = await db
      .from('artists')
      .update(updatePayload)
      .eq('id', artist.id);

    if (artistUpdateError) throw artistUpdateError;

    // 2. Add New Portfolio Item
    if (body.add_portfolio && body.add_portfolio.image_url) {
      const imgUrl = String(body.add_portfolio.image_url).trim();
      const caption = String(body.add_portfolio.caption || '').trim();
      if (imgUrl) {
        const { error: portError } = await db.from('portfolio_items').insert({
          artist_id: artist.id,
          image_url: imgUrl,
          caption: caption,
          sort_order: 0
        });
        if (portError) throw portError;
      }
    }

    // 3. Delete Portfolio Item
    if (body.delete_portfolio_id) {
      const { error: delPortError } = await db
        .from('portfolio_items')
        .delete()
        .eq('id', body.delete_portfolio_id)
        .eq('artist_id', artist.id);
      if (delPortError) throw delPortError;
    }

    // 4. Update or Add Services
    if (Array.isArray(body.services)) {
      for (const s of body.services) {
        if (!s.name) continue;
        const name = String(s.name).trim();
        const price = Math.max(0, Number(s.price_from || 0));
        const isActive = s.is_active !== false;

        if (s.id) {
          // Update existing
          await db.from('services').update({
            price_from: price,
            is_active: isActive
          }).eq('id', s.id).eq('artist_id', artist.id);
        } else {
          // Check if service by name exists, else insert
          const { data: existing } = await db
            .from('services')
            .select('id')
            .eq('artist_id', artist.id)
            .eq('name', name)
            .maybeSingle();

          if (existing) {
            await db.from('services').update({
              price_from: price,
              is_active: isActive
            }).eq('id', existing.id);
          } else {
            await db.from('services').insert({
              artist_id: artist.id,
              name,
              price_from: price,
              is_active: isActive
            });
          }
        }
      }
    }

    return NextResponse.json({ ok: true, message: 'Profile updated successfully!' });
  } catch (e: any) {
    console.error('Dashboard PATCH error:', e);
    return NextResponse.json({ error: e.message || 'Failed to update profile.' }, { status: 500 });
  }
}
