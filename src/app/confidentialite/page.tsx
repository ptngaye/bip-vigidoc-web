import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité - Site web BIP VigiDoc',
  description: 'Politique de confidentialité du site web BIP VigiDoc. Cette politique ne s\'applique pas à l\'extension navigateur.',
};

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto max-w-[960px] px-6 sm:px-10 py-8 sm:py-12">
      <article className="prose prose-gray max-w-none">
        <h1>Politique de confidentialité — Site web BIP VigiDoc</h1>

        <p className="text-sm text-gray-500">Dernière mise à jour : 3 janvier 2026</p>
        <p><strong>Éditeur :</strong> BIP Tech</p>
        <p><strong>Service concerné :</strong> Site web https://vigidoc.bip-tech.fr</p>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6">
          <p className="text-amber-800 font-medium m-0">
            ⚠️ Cette politique ne s&apos;applique pas à l&apos;extension navigateur BIP VigiDoc
          </p>
        </div>

        <hr className="my-8" />

        <section aria-labelledby="objet-title">
          <h2 id="objet-title">1. Objet de la présente politique</h2>
          <p>
            La présente politique de confidentialité décrit la manière dont BIP Tech traite les données
            personnelles dans le cadre de l&apos;utilisation du site web BIP VigiDoc, accessible à l&apos;adresse
            https://vigidoc.bip-tech.fr.
          </p>
          <p>Elle a pour objectif de garantir :</p>
          <ul>
            <li>la transparence du traitement des données,</li>
            <li>la conformité au Règlement Général sur la Protection des Données (UE) 2016/679 (RGPD),</li>
            <li>la compréhension claire des responsabilités de BIP Tech.</li>
          </ul>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="perimetre-title">
          <h2 id="perimetre-title">2. Périmètre strict — exclusion de l&apos;extension navigateur</h2>
          <p><strong>Cette politique ne concerne que le site web.</strong></p>
          <p>
            👉 L&apos;extension navigateur BIP VigiDoc fait l&apos;objet d&apos;une politique distincte, accessible à l&apos;adresse :<br />
            <Link href="/confidentialite-extension" className="text-primary-600 hover:text-primary-700 underline">
              https://vigidoc.bip-tech.fr/confidentialite-extension
            </Link>
          </p>
          <p>En particulier :</p>
          <ul>
            <li>l&apos;extension ne transmet aucun document aux serveurs de BIP Tech,</li>
            <li>l&apos;extension fonctionne exclusivement en local,</li>
            <li>les seuls appels réseau effectués par l&apos;extension visent des autorités de certification publiques agréées par l&apos;ANTS.</li>
          </ul>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="responsable-title">
          <h2 id="responsable-title">3. Responsable du traitement</h2>
          <p>
            <strong>Responsable du traitement :</strong><br />
            BIP Tech<br />
            Contact : contact@bip-tech.fr
          </p>
          <p>
            BIP Tech agit en qualité de responsable de traitement au sens de l&apos;article 4 du RGPD
            pour les traitements décrits ci-dessous.
          </p>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="donnees-title">
          <h2 id="donnees-title">4. Données personnelles traitées</h2>
          <p>Dans le cadre de l&apos;utilisation du site web, les données suivantes peuvent être traitées :</p>

          <h3>4.1 Données fournies par l&apos;utilisateur</h3>
          <ul>
            <li>Documents soumis à vérification (image ou PDF)</li>
            <li>Identifiants saisis (ex : numéro figurant sur un document administratif)</li>
            <li>Données de contexte nécessaires à l&apos;analyse technique</li>
          </ul>

          <h3>4.2 Données techniques collectées automatiquement</h3>
          <ul>
            <li>Adresse IP</li>
            <li>User-Agent (navigateur, OS)</li>
            <li>Métadonnées techniques des fichiers (format, taille, structure)</li>
            <li>Journaux techniques de sécurité (logs applicatifs)</li>
          </ul>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="finalites-title">
          <h2 id="finalites-title">5. Finalités du traitement</h2>
          <p>Les données sont traitées exclusivement pour les finalités suivantes :</p>
          <ol>
            <li>
              <strong>Exécuter l&apos;analyse technique demandée par l&apos;utilisateur</strong><br />
              (vérification de structure, de cohérence et d&apos;authenticité technique des documents)
            </li>
            <li>
              <strong>Assurer la sécurité du service</strong><br />
              (prévention des abus, détection d&apos;activités frauduleuses, protection de l&apos;infrastructure)
            </li>
            <li>
              <strong>Amélioration continue du service</strong><br />
              (analyse statistique agrégée et anonymisée uniquement)
            </li>
          </ol>
          <p>👉 <strong>Aucune donnée n&apos;est utilisée à des fins publicitaires ou de profilage.</strong></p>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="base-legale-title">
          <h2 id="base-legale-title">6. Base légale du traitement</h2>
          <p>Les traitements reposent sur :</p>
          <ul>
            <li>L&apos;exécution d&apos;un service à la demande de l&apos;utilisateur (article 6.1.b RGPD)</li>
            <li>L&apos;intérêt légitime de BIP Tech à sécuriser son service (article 6.1.f RGPD)</li>
          </ul>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="documents-title">
          <h2 id="documents-title">7. Traitement des documents soumis</h2>

          <h3>7.1 Absence d&apos;archivage</h3>
          <p>Les documents soumis via le site web :</p>
          <ul>
            <li>sont traités en mémoire ou en stockage temporaire strictement nécessaire,</li>
            <li>ne sont pas archivés,</li>
            <li>ne sont pas conservés après la fin du traitement.</li>
          </ul>
          <p>Aucun document n&apos;est :</p>
          <ul>
            <li>indexé,</li>
            <li>réutilisé,</li>
            <li>partagé,</li>
            <li>exploité à d&apos;autres fins.</li>
          </ul>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="destinataires-title">
          <h2 id="destinataires-title">8. Destinataires des données</h2>
          <p>Les données traitées sont accessibles uniquement :</p>
          <ul>
            <li>aux systèmes techniques de BIP Tech strictement nécessaires au service,</li>
            <li>à aucun tiers commercial,</li>
            <li>à aucun partenaire marketing.</li>
          </ul>
          <p><strong>Aucune donnée personnelle n&apos;est vendue, louée ou cédée.</strong></p>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="transferts-title">
          <h2 id="transferts-title">9. Transferts hors Union européenne</h2>
          <p>Les données sont traitées :</p>
          <ul>
            <li>sur des infrastructures hébergées dans l&apos;Union européenne,</li>
            <li>ou dans des pays reconnus comme offrant un niveau de protection adéquat.</li>
          </ul>
          <p>
            En cas de transfert exceptionnel hors UE, BIP Tech s&apos;engage à utiliser des garanties
            appropriées conformément au RGPD.
          </p>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="conservation-title">
          <h2 id="conservation-title">10. Durée de conservation</h2>
          <ul>
            <li><strong>Documents soumis :</strong> non conservés après l&apos;analyse</li>
            <li><strong>Logs techniques :</strong> durée limitée, proportionnée et conforme aux obligations légales et de sécurité</li>
            <li><strong>Données agrégées :</strong> anonymisées irréversiblement</li>
          </ul>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="droits-title">
          <h2 id="droits-title">11. Droits des personnes concernées</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d&apos;accès</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit d&apos;opposition</li>
            <li>Droit à la portabilité (le cas échéant)</li>
          </ul>
          <p>
            Vous pouvez exercer vos droits en contactant :<br />
            <a href="mailto:contact@bip-tech.fr" className="text-primary-600 hover:text-primary-700 underline">
              contact@bip-tech.fr
            </a>
          </p>
          <p>Une réponse vous sera apportée dans les délais légaux.</p>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="securite-title">
          <h2 id="securite-title">12. Sécurité</h2>
          <p>
            BIP Tech met en œuvre des mesures techniques et organisationnelles appropriées afin de
            garantir un niveau de sécurité adapté au risque, notamment :
          </p>
          <ul>
            <li>isolation des traitements,</li>
            <li>limitation des accès,</li>
            <li>journalisation de sécurité,</li>
            <li>durcissement de l&apos;infrastructure.</li>
          </ul>
        </section>

        <hr className="my-8" />

        <section aria-labelledby="evolution-title">
          <h2 id="evolution-title">13. Évolution de la politique</h2>
          <p>
            BIP Tech se réserve le droit de modifier la présente politique afin de l&apos;adapter à
            l&apos;évolution du service ou du cadre légal.
          </p>
          <p>
            La version applicable est celle publiée sur le site à la date de consultation.
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
