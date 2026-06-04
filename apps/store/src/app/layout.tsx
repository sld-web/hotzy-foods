import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Hotzy Foods - Bold Flavor. Zero Limits.',
  description:
    'Sri Lanka most flavorful hot sauce brand. Explore bold tastes beyond the ordinary, one bottle at a time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
