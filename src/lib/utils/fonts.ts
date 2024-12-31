import { Albert_Sans } from 'next/font/google';
import localFont from 'next/font/local';

export const sansFont = Albert_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const monoFont = localFont({
  src: '../../app/_assets/MDIO-VF.woff2',
  variable: '--font-mono',
  display: 'swap',
});

// export const monoFont = Geist_Mono({
//   variable: '--font-mono',
//   subsets: ['latin'],
// });

// export const sansFont = localFont({
//   src: './_assets/DefSansVF.woff2',
//   variable: '--font-sans',
//   display: 'swap',
// });

// export const sansFont = localFont({
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
