import type { Metadata } from 'next';
import './globals.css';
import { monoFont, sansFont } from '@/lib/utils/fonts';

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
        className={`${sansFont.variable} ${monoFont.variable} antialiased 
        bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark`}
      >
        {children}
      </body>
    </html>
  );
}
