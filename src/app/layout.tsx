import type { Metadata } from 'next';
import './globals.css';
import { monoFont, sansFont } from '@/lib/utils/fonts';
import { ThemeProvider } from 'next-themes';
import { ConvexClientProvider } from './ConvexClientProvider';
// import { ProteinStoreProvider } from '@/providers/protein-provider';
import { ClerkProvider } from '@clerk/nextjs';

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
    <ClerkProvider>
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
            {/* <ProteinStoreProvider> */}
            <ConvexClientProvider>{children}</ConvexClientProvider>
            {/* </ProteinStoreProvider> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
