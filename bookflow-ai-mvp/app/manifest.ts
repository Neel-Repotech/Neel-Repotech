import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BookFlow Beauty • Luxury Bridal & Couture Directory',
    short_name: 'BookFlow Beauty',
    description: 'Discover verified luxury bridal makeup artists worldwide with Before-and-After lookbooks and 1-Click WhatsApp booking.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfbf9',
    theme_color: '#43122b',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon'
      }
    ]
  };
}
