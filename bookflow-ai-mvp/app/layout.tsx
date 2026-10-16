import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'BookFlow Beauty | Find a Makeup Artist Near You',
  description: 'Discover makeup artists near you for bridal, engagement, haldi, reception and party makeup. Compare services and send booking enquiries.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
