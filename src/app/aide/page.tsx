import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aide - BIP VigiDoc',
  description: "Centre d'aide BIP VigiDoc. Conseils pour vérifier vos documents administratifs.",
};

export default function AidePage() {
  return (
    <main className="mx-auto max-w-[960px] px-6 sm:px-10 py-8 sm:py-12">
      <article className="prose prose-gray max-w-none">
        <h1>Aide</h1>

        <p>
          Bienvenue sur le centre d&apos;aide BIP VigiDoc. Vous trouverez ici toutes les
          informations nécessaires pour utiliser notre service de vérification de documents.
        </p>

        <section id="photo" aria-labelledby="photo-title">
          <h2 id="photo-title">Conseils pour une photo réussie</h2>
          <ul>
            <li>
              Placez le document <strong>à plat</strong> sur une surface unie
            </li>
            <li>
              Assurez-vous d&apos;avoir une <strong>bonne lumière</strong> (naturelle de préférence)
            </li>
            <li>
              Vérifiez que tous les <strong>bords sont visibles</strong>
            </li>
            <li>
              Évitez les <strong>reflets et ombres</strong>
            </li>
            <li>N&apos;utilisez pas de captures d&apos;écran compressées</li>
          </ul>
        </section>

        <section aria-labelledby="formats-title">
          <h2 id="formats-title">Formats acceptés</h2>
          <ul>
            <li>
              <strong>PDF</strong> — documents scannés ou numériques
            </li>
            <li>
              <strong>JPG/JPEG</strong> — photos de documents
            </li>
            <li>
              <strong>PNG</strong> — images de haute qualité
            </li>
          </ul>
          <p>
            Taille maximale : <strong>10 Mo</strong>
          </p>
        </section>

        <section aria-labelledby="faq-title">
          <h2 id="faq-title">Questions fréquentes</h2>

          <h3>Quels documents puis-je vérifier ?</h3>
          <p>
            BIP VigiDoc permet de vérifier l&apos;authenticité des documents administratifs français
            (carte d&apos;identité, passeport, permis de conduire, etc.).
          </p>

          <h3>Mes données sont-elles sécurisées ?</h3>
          <p>
            Vos documents sont analysés de manière sécurisée et ne sont pas conservés après
            l&apos;analyse. Consultez notre{' '}
            <Link href="/confidentialite">politique de confidentialité</Link> pour plus de détails.
          </p>

          <h3>L&apos;analyse est-elle gratuite ?</h3>
          <p>Oui, le service BIP VigiDoc est entièrement gratuit et ne nécessite pas de compte.</p>
        </section>

        <section aria-labelledby="contact-title">
          <h2 id="contact-title">Besoin d&apos;aide supplémentaire ?</h2>
          <p>
            Si vous avez des questions ou rencontrez des difficultés, n&apos;hésitez pas à nous
            contacter.
          </p>
        </section>

        <p className="mt-8">
          <Link href="/" className="text-primary-600 hover:text-primary-700 underline">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </article>
    </main>
  );
}
