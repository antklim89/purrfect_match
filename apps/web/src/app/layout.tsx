import '@fontsource/figtree/400-italic.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/700-italic.css';
import '@fontsource/figtree/700.css';
import './styles/main.css';
import type { Metadata } from 'next';

import { Footer } from '@/widgets/footer/ui';
import { Header } from '@/widgets/header/ui';

export const metadata: Metadata = {
  title: {
    default: 'Home',
    template: '&s | Example',
  },
};

function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="32x32" />
      </head>
      <body className="grid h-screen grid-rows-[auto_1fr_auto]">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

export default RootLayout;
