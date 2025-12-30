import type { Metadata } from 'next';
import { Header, Footer } from '@ui/components';
import './globals.css';

export const metadata: Metadata = {
  title: 'BIP VigiDoc - Vérification de documents administratifs',
  description:
    "Vérifiez l'authenticité de vos documents administratifs français en quelques secondes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
