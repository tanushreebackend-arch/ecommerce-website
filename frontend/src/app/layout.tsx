import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { SettingsProvider } from '@/context/SettingsContext';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CartSync from '@/components/cart/CartSync';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ChatWidget from '@/components/ChatWidget';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NOW Foods SAMe 400 mg — Shop Now',
  description: 'NOW Foods SAMe 400 mg supports mood, nervous system health, and joint comfort. Stabilized formula, maximum strength.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="font-body antialiased">
        <SettingsProvider>
          <ThemeProvider />
          <AnnouncementBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <CartSync />
          <ChatWidget />
          <Toaster position="top-right" />
        </SettingsProvider>
      </body>
    </html>
  );
}
