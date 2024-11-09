// src/app/layout.tsx
import { Providers } from './providers';
import '@/styles/globals.css';
import { epilogue } from './fonts/fonts';

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
