import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

async function verifyAdmin(req: NextRequest) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return { error: 'Sign in required.', status: 401 as const };

  const db = createAdminSupabase();
  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user) return { error: 'Session expired.', status: 401 as const };

  const { data: profile } = await db.from('profiles').select('role, full_name').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return { error: 'Admin access required.', status: 403 as const };

  return { db, adminUser: user, adminProfile: profile };
}

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdmin(req);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    // 1. Fetch all artists
    const { data: artistsData, error: artistError } = await auth.db
      .from('artists')
      .select('id, business_name, slug, bio, city, area, starting_price, status, verified_at, created_at, updated_at, user_id, address_public, services(id, name, price_from, is_active), portfolio_items(id, image_url, caption)')
      .order('created_at', { ascending: false });

    if (artistError) throw artistError;

    // 2. Fetch all profiles & auth users to attach user details
    const { data: profiles } = await auth.db.from('profiles').select('id, full_name, phone, role');
    const { data: authUsers } = await auth.db.auth.admin.listUsers();

    const profileMap = new Map((profiles || []).map(p => [p.id, p]));
    const userMap = new Map((authUsers?.users || []).map(u => [u.id, u]));

    const enriched = (artistsData || []).map((a: any) => {
      const prof = profileMap.get(a.user_id);
      const authUser = userMap.get(a.user_id);

      let instagram = '';
      let experience = '';
      if (a.address_public) {
        try {
          const parsed = JSON.parse(a.address_public);
          instagram = parsed.instagram || '';
          experience = parsed.experience || '';
        } catch {
          if (a.address_public.includes('instagram.com') || a.address_public.startsWith('@')) {
            instagram = a.address_public;
          }
        }
      }

      return {
        ...a,
        instagram,
        experience,
        email: authUser?.email || '',
        full_name: prof?.full_name || '',
        phone: prof?.phone || '',
        role: prof?.role || 'artist',
        services_count: (a.services || []).length,
        portfolio_count: (a.portfolio_items || []).length
      };
    });

    return NextResponse.json({
      artists: enriched,
      admin: {
        id: auth.adminUser.id,
        email: auth.adminUser.email,
        fullName: auth.adminProfile.full_name
      }
    });
  } catch (e: any) {
    console.error('Admin GET error:', e);
    return NextResponse.json({ error: 'Could not load artists.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAdmin(req);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { artistId } = body;
    if (!artistId || typeof artistId !== 'string') {
      return NextResponse.json({ error: 'Valid artist ID required.' }, { status: 400 });
    }

    const { data: artist, error: findError } = await auth.db
      .from('artists')
      .select('id, user_id, address_public')
      .eq('id', artistId)
      .maybeSingle();

    if (findError || !artist) return NextResponse.json({ error: 'Artist not found.' }, { status: 404 });

    // 1. Update Status if provided
    if (body.status && ['approved', 'rejected', 'suspended', 'pending'].includes(body.status)) {
      const status = body.status;
      await auth.db.from('artists').update({
        status,
        verified_at: status === 'approved' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }).eq('id', artistId);
    }

    // 2. Update Role (grant or revoke admin) if provided
    if (body.role && ['admin', 'artist', 'customer'].includes(body.role)) {
      await auth.db.from('profiles').update({ role: body.role }).eq('id', artist.user_id);
    }

    // 3. Update Artist Details if provided (direct admin control over profiles)
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (typeof body.business_name === 'string' && body.business_name.trim()) updates.business_name = body.business_name.trim();
    if (typeof body.bio === 'string') updates.bio = body.bio.trim();
    if (typeof body.city === 'string' && body.city.trim()) updates.city = body.city.trim();
    if (typeof body.area === 'string' && body.area.trim()) updates.area = body.area.trim();
    if (body.starting_price !== undefined) updates.starting_price = Math.max(0, Number(body.starting_price) || 0);

    // Instagram / Experience
    if (body.instagram !== undefined || body.experience !== undefined) {
      let meta: Record<string, any> = {};
      try {
        meta = artist.address_public ? JSON.parse(artist.address_public) : {};
      } catch {
        meta = {};
      }
      if (body.instagram !== undefined) meta.instagram = String(body.instagram).trim();
      if (body.experience !== undefined) meta.experience = String(body.experience).trim();
      updates.address_public = JSON.stringify(meta);
    }

    if (Object.keys(updates).length > 1) {
      await auth.db.from('artists').update(updates).eq('id', artistId);
    }

    return NextResponse.json({ ok: true, message: 'Artist profile updated successfully by admin.' });
  } catch (e: any) {
    console.error('Admin PATCH error:', e);
    return NextResponse.json({ error: e.message || 'Could not update artist status.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAdmin(req);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const artistId = searchParams.get('artistId');
    if (!artistId) return NextResponse.json({ error: 'Artist ID required.' }, { status: 400 });

    const { error } = await auth.db.from('artists').delete().eq('id', artistId);
    if (error) throw error;

    return NextResponse.json({ ok: true, message: 'Artist deleted successfully.' });
  } catch (e: any) {
    console.error('Admin DELETE error:', e);
    return NextResponse.json({ error: e.message || 'Could not delete artist.' }, { status: 500 });
  }
}
