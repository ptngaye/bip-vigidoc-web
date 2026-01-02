import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité - Extension Chrome BIP VigiDoc',
  description:
    "Politique de confidentialité de l'extension Chrome BIP VigiDoc pour la vérification de documents 2D-Doc.",
};

export default function ConfidentialiteExtensionPage() {
  return (
    <main className="mx-auto max-w-[960px] px-6 sm:px-10 py-8 sm:py-12">
      <article className="prose prose-gray max-w-none">
        <h1>Politique de confidentialité — Extension Chrome BIP VigiDoc</h1>

        <p className="text-sm text-gray-500">Dernière mise à jour : janvier 2026</p>

        <section aria-labelledby="champ-title">
          <h2 id="champ-title">1. Champ d&apos;application</h2>
          <p>
            La présente politique de confidentialité s&apos;applique exclusivement à
            l&apos;extension Chrome BIP VigiDoc publiée sur le Chrome Web Store.
          </p>
          <p>Elle ne concerne pas :</p>
          <ul>
            <li>la plateforme web BIP VigiDoc</li>
            <li>l&apos;API BIP VigiDoc</li>
            <li>tout autre service en ligne de BIP Tech</li>
          </ul>
        </section>

        <section aria-labelledby="principe-title">
          <h2 id="principe-title">2. Principe général</h2>
          <p>
            L&apos;extension Chrome BIP VigiDoc est conçue selon un principe strict de{' '}
            <strong>privacy by design</strong>.
          </p>
          <p>
            Toutes les opérations de vérification documentaire sont réalisées{' '}
            <strong>localement dans le navigateur</strong> de l&apos;utilisateur.
          </p>
        </section>

        <section aria-labelledby="traitees-title">
          <h2 id="traitees-title">3. Données traitées</h2>
          <p>Lors de l&apos;utilisation de l&apos;extension :</p>
          <ul>
            <li>
              Le document sélectionné par l&apos;utilisateur (PDF ou image) est analysé localement
            </li>
            <li>Le contenu du document ne quitte jamais le navigateur</li>
            <li>Aucune donnée documentaire n&apos;est transmise à un serveur</li>
          </ul>
        </section>

        <section aria-labelledby="collectees-title">
          <h2 id="collectees-title">4. Données collectées</h2>
          <p>
            <strong>Aucune donnée personnelle n&apos;est collectée</strong> par l&apos;extension.
          </p>
          <p>En particulier :</p>
          <ul>
            <li>aucun document n&apos;est envoyé ou stocké sur un serveur</li>
            <li>aucune adresse IP n&apos;est collectée</li>
            <li>aucun identifiant utilisateur n&apos;est utilisé</li>
            <li>aucun cookie ou traceur n&apos;est déployé</li>
          </ul>
        </section>

        <section aria-labelledby="stockage-title">
          <h2 id="stockage-title">5. Stockage local</h2>
          <p>
            L&apos;extension utilise uniquement un stockage technique local (
            <code>chrome.storage.local</code>) pour :
          </p>
          <ul>
            <li>
              conserver temporairement un cache des certificats publics ANTS (TSL) nécessaires à la
              vérification cryptographique des documents 2D-Doc
            </li>
          </ul>
          <p>Ce cache :</p>
          <ul>
            <li>ne contient aucune donnée utilisateur</li>
            <li>est automatiquement renouvelé</li>
            <li>
              est supprimable à tout moment par l&apos;utilisateur via les paramètres du navigateur
            </li>
          </ul>
        </section>

        <section aria-labelledby="utilisation-title">
          <h2 id="utilisation-title">6. Utilisation des données</h2>
          <p>Les données traitées localement sont utilisées exclusivement pour :</p>
          <ul>
            <li>vérifier l&apos;intégrité cryptographique des documents 2D-Doc</li>
            <li>assurer le bon fonctionnement technique de l&apos;extension</li>
          </ul>
        </section>

        <section aria-labelledby="conservation-title">
          <h2 id="conservation-title">7. Conservation des données</h2>
          <ul>
            <li>Les documents analysés ne sont pas conservés après la vérification</li>
            <li>Aucun historique de documents n&apos;est maintenu par l&apos;extension</li>
            <li>
              Le cache technique des certificats est conservé pour une durée limitée et renouvelé
              automatiquement
            </li>
          </ul>
        </section>

        <section aria-labelledby="droits-title">
          <h2 id="droits-title">8. Vos droits</h2>
          <p>
            L&apos;extension ne collectant ni ne stockant de données personnelles, les droits prévus
            par le RGPD (accès, rectification, effacement, portabilité) ne s&apos;appliquent pas
            dans ce contexte.
          </p>
        </section>

        <section aria-labelledby="contact-title">
          <h2 id="contact-title">9. Contact</h2>
          <p>
            Pour toute question relative à la confidentialité de l&apos;extension Chrome BIP
            VigiDoc, vous pouvez contacter :
          </p>
          <p>
            <a
              href="mailto:contact@bip-tech.fr"
              className="text-primary-600 hover:text-primary-700"
            >
              contact@bip-tech.fr
            </a>
          </p>
        </section>

        <section aria-labelledby="responsable-title">
          <h2 id="responsable-title">10. Responsable du traitement</h2>
          <p>
            <strong>BIP Tech</strong>
            <br />
            Éditeur de l&apos;extension Chrome BIP VigiDoc
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8 border-t pt-4">
          Cette politique est susceptible d&apos;évoluer afin de rester conforme aux exigences
          réglementaires et aux évolutions techniques de l&apos;extension.
        </p>

        <p className="mt-4">
          <Link href="/" className="text-primary-600 hover:text-primary-700 underline">
            &larr; Retour à l&apos;accueil
          </Link>
        </p>
      </article>
    </main>
  );
}
