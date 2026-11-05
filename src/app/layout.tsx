import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { Navbar } from '@/components/navigation/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Soldeer Bolivia | Equipos e Insumos de Soldadura Industrial',
  description: 'Portal B2B de maquinaria de soldadura, alambres, torchas y consumibles industriales en Santa Cruz, Bolivia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-slate-800 antialiased`}>
        {/* Navbar Global con Desplegables Tipo Jasic */}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}