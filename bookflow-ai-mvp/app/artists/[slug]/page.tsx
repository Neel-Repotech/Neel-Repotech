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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neel-repotech.vercel.app';
  const ogUrl = `${siteUrl}/api/og?title=${encodeURIComponent(artist.business_name)}&location=${encodeURIComponent(`${artist.area}, ${artist.city}`)}&price=${encodeURIComponent(`₹${(artist.starting_price || 0).toLocaleString('en-IN')}`)}&rating=5.0`;

  return {
    title: `${artist.business_name} | Makeup Artist in ${artist.area}, ${artist.city}`,
    description: `Book ${artist.business_name} for bridal, engagement and party makeup in ${artist.area}, ${artist.city}. View portfolio photos, client reviews and chat on WhatsApp.`,
    openGraph: {
      title: `${artist.business_name} • Verified Luxury Bridal Artist`,
      description: `Book ${artist.business_name} for bridal, engagement, and destination wedding makeup in ${artist.area}, ${artist.city}. Compare real Before-and-After lookbooks and book via 1-Click WhatsApp.`,
      url: `${siteUrl}/artists/${artist.slug}`,
      siteName: 'BookFlow Beauty',
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `${artist.business_name} - Bridal Makeup Artist`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist.business_name} • Luxury Bridal Artist`,
      description: `Book ${artist.business_name} in ${artist.area}, ${artist.city}. 1-Click WhatsApp Booking.`,
      images: [ogUrl]
    }
  };
}

export default async function ArtistProfilePage({ params }: Props) {
  const artist = await getArtist(params.slug);
  if (!artist) notFound();

  return <ArtistProfileView artist={artist} />;
}
