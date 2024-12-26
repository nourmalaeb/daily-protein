import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { MainWrapper } from '@/components/mainWrapper';
import { AppHeader } from '@/components/appHeader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainWrapper>
          <AppHeader />
          {children}
        </MainWrapper>
      </body>
    </html>
  );
}
