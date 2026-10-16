import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, hasSupabaseConfig } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!hasSupabaseConfig()) return NextResponse.json({ error: 'Database not connected.' }, { status: 503 });

    const body = await req.json();
    const { artistId, author, rating, event, comment } = body;

    if (!artistId || !author || !rating || !comment) {
      return NextResponse.json({ error: 'Please provide your name, rating, and review comments.' }, { status: 400 });
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const db = createAdminSupabase();

    const { data: artist, error: findError } = await db
      .from('artists')
      .select('id, address_public')
      .eq('id', artistId)
      .maybeSingle();

    if (findError || !artist) return NextResponse.json({ error: 'Artist not found.' }, { status: 404 });

    let meta: Record<string, any> = {};
    try {
      meta = artist.address_public ? JSON.parse(artist.address_public) : {};
    } catch {
      meta = {};
    }

    const reviews = Array.isArray(meta.reviews) ? meta.reviews : [];
    const newReview = {
      id: 'rev_' + Date.now().toString(36),
      author: String(author).trim().slice(0, 80),
      rating: numericRating,
      event: String(event || 'Makeup Service').trim().slice(0, 60),
      comment: String(comment).trim().slice(0, 800),
      date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    };

    reviews.unshift(newReview);
    meta.reviews = reviews.slice(0, 100); // keep up to 100 recent reviews

    const { error: updateError } = await db
      .from('artists')
      .update({
        address_public: JSON.stringify(meta),
        updated_at: new Date().toISOString()
      })
      .eq('id', artist.id);

    if (updateError) throw updateError;

    return NextResponse.json({ ok: true, message: 'Review submitted successfully!', review: newReview });
  } catch (e: any) {
    console.error('Submit review error:', e);
    return NextResponse.json({ error: 'Could not submit review.' }, { status: 500 });
  }
}
