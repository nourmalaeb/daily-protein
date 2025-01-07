import type { Metadata } from 'next';
import './globals.css';
import { monoFont, sansFont } from '@/lib/utils/fonts';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'daily protein',
  description: 'eat your gains',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sansFont.variable} ${monoFont.variable} antialiased 
          bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          scriptProps={{ 'data-cfasync': 'false' }}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
