import type { Metadata } from 'next';
import { Geist, Geist_Mono, Albert_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const sansFont = Albert_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
});

// const monoFont = Geist_Mono({
//   variable: '--font-mono',
//   subsets: ['latin'],
// });

// const sansFont = localFont({
//   src: './_assets/DefSansVF.woff2',
//   variable: '--font-sans',
//   display: 'swap',
// });

const monoFont = localFont({
  src: './_assets/MDIO-VF.woff2',
  variable: '--font-mono',
  display: 'swap',
});

// const sansFont = localFont({
//   src: [
//     {
//       path: './_assets/NTBau/NTBau-Light.woff2',
//       weight: '300',
//     },
//     {
//       path: './_assets/NTBau/NTBau-Regular.woff2',
//       weight: '400',
//     },
//     {
//       path: './_assets/NTBau/NTBau-Medium.woff2',
//       weight: '500',
//     },
//     {
//       path: './_assets/NTBau/NTBau-Bold.woff2',
//       weight: '700',
//     },
//     {
//       path: './_assets/NTBau/NTBau-Black.woff2',
//       weight: '800',
//     },
//   ],
//   variable: '--font-sans',
//   display: 'swap',
// });

export const metadata: Metadata = {
  title: 'daily proteins',
  description: 'eat your gains',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sansFont.variable} ${monoFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
