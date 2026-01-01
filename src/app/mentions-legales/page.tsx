import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales - BIP VigiDoc',
  description: 'Mentions légales du service BIP VigiDoc.',
};

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-[960px] px-6 sm:px-10 py-8 sm:py-12">
      <article className="prose prose-gray max-w-none">
        <h1>Mentions légales</h1>

        <section aria-labelledby="editeur-title">
          <h2 id="editeur-title">Éditeur du site</h2>
          <p>
            <strong>BIP Tech</strong>
            <br />
            Bureau Informatique des PME, TPE et Indépendants
          </p>
        </section>

        <section aria-labelledby="directeur-title">
          <h2 id="directeur-title">Directeur de la publication</h2>
          <p>Le directeur de la publication est le représentant légal de BIP Tech.</p>
        </section>

        <section aria-labelledby="hebergement-title">
          <h2 id="hebergement-title">Hébergement</h2>
          <p>
            Ce site est hébergé par Vercel Inc.
            <br />
            340 S Lemon Ave #4133
            <br />
            Walnut, CA 91789, USA
          </p>
        </section>

        <section aria-labelledby="propriete-title">
          <h2 id="propriete-title">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, logos, structure) est la
            propriété exclusive de BIP Tech, sauf mention contraire. Toute reproduction, même
            partielle, est interdite sans autorisation préalable.
          </p>
        </section>

        <section aria-labelledby="responsabilite-title">
          <h2 id="responsabilite-title">Limitation de responsabilité</h2>
          <p>
            Les informations fournies par le service BIP VigiDoc sont données à titre indicatif.
            Elles ne sauraient engager la responsabilité de BIP Tech en cas d&apos;erreur,
            d&apos;omission ou de résultat jugé insatisfaisant.
          </p>
        </section>

        <section aria-labelledby="donnees-title">
          <h2 id="donnees-title">Protection des données personnelles</h2>
          <p>
            Pour toute information concernant le traitement de vos données personnelles, veuillez
            consulter notre <Link href="/confidentialite">politique de confidentialité</Link>.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">Dernière mise à jour : janvier 2025</p>

        <p className="mt-4">
          <Link href="/" className="text-primary-600 hover:text-primary-700 underline">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </article>
    </main>
  );
}
