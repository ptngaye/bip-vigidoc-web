import type { Metadata } from 'next';
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
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
