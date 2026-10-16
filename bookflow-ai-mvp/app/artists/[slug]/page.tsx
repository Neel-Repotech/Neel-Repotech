import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createAdminSupabase, hasSupabaseConfig } from '@/lib/supabase-admin';
import ArtistProfileView from './ArtistProfileView';

type Props = { params: { slug: string } };

async function getArtist(slug: string) {
  if (!hasSupabaseConfig()) return null;
  const db = createAdminSupabase();
  const { data, error } = await db
    .from('artists')
    .select('id, business_name, slug, bio, city, area, starting_price, status, address_public, services(id, name, description, price_from, duration_minutes, is_active), portfolio_items(id, image_url, caption, sort_order)')
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  // Extract metadata
  let instagram = '';
  let experience = '';
  let whatsapp = '';
  let before_after = null;
  let reviews: any[] = [];

  if (data.address_public) {
    try {
      const meta = JSON.parse(data.address_public);
      instagram = meta.instagram || '';
      experience = meta.experience || '';
      whatsapp = meta.whatsapp || '';
      before_after = meta.before_after || null;
      reviews = Array.isArray(meta.reviews) ? meta.reviews : [];
    } catch {
      if (data.address_public.includes('instagram.com') || data.address_public.startsWith('@')) {
        instagram = data.address_public;
      }
    }
  }

  return {
    ...data,
    instagram,
    experience,
    whatsapp,
    before_after,
    reviews
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await getArtist(params.slug);
  if (!artist) return { title: 'Artist profile | BookFlow Beauty' };
  return {
    title: `${artist.business_name} | Makeup Artist in ${artist.area}, ${artist.city}`,
    description: `Book ${artist.business_name} for bridal, engagement and party makeup in ${artist.area}, ${artist.city}. View portfolio photos, client reviews and chat on WhatsApp.`
  };
}

export default async function ArtistProfilePage({ params }: Props) {
  const artist = await getArtist(params.slug);
  if (!artist) notFound();

  return <ArtistProfileView artist={artist} />;
}
