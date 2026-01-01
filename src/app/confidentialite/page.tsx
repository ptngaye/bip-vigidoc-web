import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité - BIP VigiDoc',
  description: 'Politique de confidentialité du service BIP VigiDoc.',
};

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto max-w-[960px] px-6 sm:px-10 py-8 sm:py-12">
      <article className="prose prose-gray max-w-none">
        <h1>Politique de confidentialité</h1>

        <p className="lead">
          BIP Tech s&apos;engage à protéger la vie privée des utilisateurs du service BIP VigiDoc.
        </p>

        <section aria-labelledby="collecte-title">
          <h2 id="collecte-title">Données collectées</h2>
          <p>
            Lors de l&apos;utilisation du service, les données suivantes peuvent être collectées :
          </p>
          <ul>
            <li>Le document soumis à vérification (image ou PDF)</li>
            <li>Les métadonnées techniques (type de fichier, taille)</li>
            <li>L&apos;adresse IP à des fins de sécurité</li>
          </ul>
        </section>

        <section aria-labelledby="utilisation-title">
          <h2 id="utilisation-title">Utilisation des données</h2>
          <p>Les documents soumis sont utilisés exclusivement pour :</p>
          <ul>
            <li>Effectuer l&apos;analyse d&apos;authenticité demandée</li>
            <li>Améliorer la qualité du service</li>
            <li>Assurer la sécurité du service</li>
          </ul>
        </section>

        <section aria-labelledby="conservation-title">
          <h2 id="conservation-title">Conservation des données</h2>
          <p>
            Les documents soumis ne sont pas conservés après l&apos;analyse. Les journaux techniques
            sont conservés pendant une durée limitée conformément aux obligations légales.
          </p>
        </section>

        <section aria-labelledby="droits-title">
          <h2 id="droits-title">Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d&apos;opposition</li>
          </ul>
        </section>

        <section aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <p>
            Pour toute question relative à la protection de vos données personnelles, vous pouvez
            nous contacter.
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
