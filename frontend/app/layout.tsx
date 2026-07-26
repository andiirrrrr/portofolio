import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/ui/Navbar';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = 'https://portofolio-seven-zeta-19.vercel.app';
const title = 'Andi Ranreng Sombeng | Full Stack Developer';
const description =
  'Portfolio Andi Ranreng Sombeng — Full-Stack Web Developer (Laravel, React, Next.js, MySQL). Membangun company profile, landing page, dan sistem web kustom.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  authors: [{ name: 'Andi Ranreng Sombeng' }],
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Andi Ranreng Sombeng',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
