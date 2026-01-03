import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Header, Footer } from '@ui/components';
import './globals.css';

export const metadata: Metadata = {
  title: 'BIP VigiDoc - Vérification de documents administratifs',
  description:
    "Vérifiez l'authenticité de vos documents administratifs français en quelques secondes.",
  verification: {
    google: 'KE2Fgm5IO03wuvHR5nL0J47iRmS7wkOsr1EpFghciu0',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
