import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibilité - BIP VigiDoc',
  description: 'Déclaration d\'accessibilité du service BIP VigiDoc.',
};

export default function AccessibilitePage() {
  return (
    <main className="mx-auto max-w-[960px] px-6 sm:px-10 py-8 sm:py-12">
      <article className="prose prose-gray max-w-none">
        <h1>Déclaration d&apos;accessibilité</h1>

        <p className="lead">
          BIP Tech s&apos;engage à rendre le service BIP VigiDoc accessible conformément
          à l&apos;article 47 de la loi n°2005-102 du 11 février 2005.
        </p>

        <section aria-labelledby="conformite-title">
          <h2 id="conformite-title">État de conformité</h2>
          <p>
            Le service BIP VigiDoc est en <strong>conformité partielle</strong> avec le
            Référentiel Général d&apos;Amélioration de l&apos;Accessibilité (RGAA) version 4.1
            et les critères WCAG 2.1 niveau AA.
          </p>
        </section>

        <section aria-labelledby="perimetre-title">
          <h2 id="perimetre-title">Périmètre</h2>
          <p>
            Cette déclaration d&apos;accessibilité s&apos;applique au site vigidoc.bip-tech.fr.
          </p>
        </section>

        <section aria-labelledby="ameliorations-title">
          <h2 id="ameliorations-title">Améliorations et contact</h2>
          <p>
            Nous travaillons continuellement à améliorer l&apos;accessibilité de notre service.
            Si vous rencontrez des difficultés d&apos;accessibilité, merci de nous le signaler.
          </p>
          <p>
            Nous nous efforcerons de vous apporter une réponse dans les meilleurs délais.
          </p>
        </section>

        <section aria-labelledby="recours-title">
          <h2 id="recours-title">Voies de recours</h2>
          <p>
            Si vous constatez un défaut d&apos;accessibilité vous empêchant d&apos;accéder à un
            contenu ou une fonctionnalité du site, et que vous nous l&apos;avez signalé sans
            obtenir de réponse satisfaisante, vous êtes en droit de :
          </p>
          <ul>
            <li>
              Écrire un message au{' '}
              <a href="https://formulaire.defenseurdesdroits.fr" target="_blank" rel="noopener noreferrer">
                Défenseur des droits
              </a>
            </li>
            <li>
              Contacter le délégué du{' '}
              <a href="https://www.defenseurdesdroits.fr/saisir/delegues" target="_blank" rel="noopener noreferrer">
                Défenseur des droits dans votre région
              </a>
            </li>
            <li>
              Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) :<br />
              Défenseur des droits<br />
              Libre réponse 71120<br />
              75342 Paris CEDEX 07
            </li>
          </ul>
        </section>

        <section aria-labelledby="technologies-title">
          <h2 id="technologies-title">Technologies utilisées</h2>
          <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript (React/Next.js)</li>
            <li>WAI-ARIA</li>
          </ul>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Dernière mise à jour : janvier 2025
        </p>

        <p className="mt-4">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </article>
    </main>
  );
}
