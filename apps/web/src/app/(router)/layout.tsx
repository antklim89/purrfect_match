import '@fontsource/figtree/400-italic.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/700-italic.css';
import '@fontsource/figtree/700.css';
import '../styles/main.css';
import type { Metadata } from 'next';

import { Toaster } from '@/shared/ui/sonner';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import ZodConfig from '../config/zod-config';
import { ThemeProvider } from '../providers/theme-provider';

export const metadata: Metadata = {
  title: {
    default: 'Home',
    template: '&s | Example',
  },
};

function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="32x32" />
      </head>
      <body className="grid min-h-screen grid-rows-[auto_1fr_auto]">
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
        <ZodConfig />
      </body>
    </html>
  );
}

export default RootLayout;
