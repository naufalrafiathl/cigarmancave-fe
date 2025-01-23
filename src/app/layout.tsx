// src/app/layout.tsx
import { Providers } from './providers';
import '@/styles/globals.css';
import { epilogue } from './fonts/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cigar Mancave',
  description: 'Social Cigar Platform',
  manifest: '/manifest.json',
  themeColor: '#171717',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cigar Mancave',
  },
  icons: {
    icon: '/icons/icon-512x512.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={epilogue.variable}>
      <body className={`${epilogue.className} font-epilogue`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}