import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Hotzy Foods — Bold Flavor. Zero Limits.',
  description:
    "Sri Lanka's most flavorful hot sauce brand. Explore bold tastes beyond the ordinary, one bottle at a time.",
  keywords: [
    'hot sauce',
    'Sri Lankan food',
    'hotzy',
    'hot sauce Sri Lanka',
    'spicy sauce',
    'chili sauce',
  ],
  openGraph: {
    title: 'Hotzy Foods — Bold Flavor. Zero Limits.',
    description:
      "Sri Lanka's most flavorful hot sauce brand. Explore bold tastes beyond the ordinary, one bottle at a time.",
    type: 'website',
    locale: 'en_US',
    siteName: 'Hotzy Foods',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
