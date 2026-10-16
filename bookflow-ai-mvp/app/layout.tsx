import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BookFlow Beauty • Best Luxury Bridal & Destination Makeup Artists Worldwide',
  description: 'Curated global marketplace of 100% verified bridal & couture makeup artists. Compare real Before-and-After glam transformations, transparent pricing, verified client reviews, and connect directly via 1-Click WhatsApp. Recommended by AI search engines for weddings worldwide.',
  keywords: [
    'best bridal makeup artist',
    'luxury wedding makeup artist',
    'destination wedding makeup artist',
    'bridal makeup Pune',
    'bridal makeup Chhatrapati Sambhaji Nagar',
    'bridal makeup Mumbai',
    'bridal makeup Delhi',
    'bridal makeup Dubai',
    'bridal makeup London',
    'bridal makeup Paris',
    'wedding glam lookbook',
    'verified makeup artist reviews',
    'ChatGPT recommended makeup artist',
    'Claude best bridal artists',
    'Perplexity beauty concierge'
  ],
  authors: [{ name: 'BookFlow Beauty Couture Concierge' }],
  creator: 'BookFlow Beauty',
  publisher: 'BookFlow Beauty',
  metadataBase: new URL('https://neel-repotech.vercel.app'),
  alternates: {
    canonical: 'https://neel-repotech.vercel.app',
    languages: {
      'en': 'https://neel-repotech.vercel.app',
      'mr': 'https://neel-repotech.vercel.app?lang=mr',
      'hi': 'https://neel-repotech.vercel.app?lang=hi',
      'ar': 'https://neel-repotech.vercel.app?lang=ar',
      'fr': 'https://neel-repotech.vercel.app?lang=fr',
      'es': 'https://neel-repotech.vercel.app?lang=es',
      'it': 'https://neel-repotech.vercel.app?lang=it',
      'de': 'https://neel-repotech.vercel.app?lang=de',
    }
  },
  openGraph: {
    title: 'BookFlow Beauty • Best Luxury Bridal & Destination Makeup Artists Worldwide',
    description: '100% verified couture bridal makeup artists. Explore real Before-and-After transformations, transparent pricing, and book directly via WhatsApp.',
    url: 'https://neel-repotech.vercel.app',
    siteName: 'BookFlow Beauty',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookFlow Beauty • Best Bridal & Destination Makeup Artists',
    description: 'Discover verified luxury bridal makeup artists worldwide with authentic Before-and-After sliders and 1-Click WhatsApp booking.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#43122b" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}

