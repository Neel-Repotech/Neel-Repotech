import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, hasSupabaseConfig } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!token || !hasSupabaseConfig()) {
      return NextResponse.json({ authenticated: false });
    }

    const db = createAdminSupabase();
    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ authenticated: false });
    }

    const { data: profile } = await db.from('profiles').select('id, full_name, role, phone').eq('id', user.id).maybeSingle();
    const { data: artist } = await db.from('artists').select('id, business_name, slug, status, city, area').eq('user_id', user.id).maybeSingle();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: profile?.full_name || user.email?.split('@')[0] || 'User',
        role: profile?.role || 'artist',
        phone: profile?.phone || '',
      },
      artist: artist ? {
        id: artist.id,
        businessName: artist.business_name,
        slug: artist.slug,
        status: artist.status,
        city: artist.city,
        area: artist.area
      } : null
    });
  } catch (error: any) {
    console.error('Error fetching auth state in /api/me:', error);
    return NextResponse.json({ authenticated: false, error: error?.message });
  }
}
