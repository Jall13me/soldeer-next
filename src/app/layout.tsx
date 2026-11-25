import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/navigation/Navbar';
import { siteConfig } from '@/config/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Soldeer Bolivia | Equipos e Insumos de Soldadura Industrial',
    template: `%s | ${siteConfig.name} Bolivia`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'es_BO',
    siteName: siteConfig.name,
    title: 'Soldeer Bolivia | Equipos e Insumos de Soldadura Industrial',
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#0d9488',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-slate-800 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
