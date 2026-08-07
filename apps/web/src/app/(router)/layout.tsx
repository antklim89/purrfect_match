import '@fontsource/figtree/400-italic.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/700-italic.css';
import '@fontsource/figtree/700.css';
import '../styles/main.css';
import type { Metadata } from 'next';

import mainImage from '@/shared/assets/main-image.jpg';
import { env } from '@/shared/lib/env';
import { Toaster } from '@/shared/ui/sonner';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import ZodConfig from '../config/zod-config';
import { ThemeProvider } from '../providers/theme-provider';

export function generateMetadata(): Metadata {
  const title = 'Purrfect Match';
  const description = 'This is a convenient platform for placing ads for the sale of pets or find a fitting pet.';

  return {
    metadataBase: env.WEB_URL,
    title: {
      default: `Home | ${title}`,
      template: `%s | ${title}`,
    },
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      images: [mainImage.src],
    },
    twitter: {
      title,
      description,
      images: [mainImage.src],
    },
  };
}

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
