'use client';

import { DocumentDropZone } from './DocumentDropZone';
import { FeatureBadges } from './FeatureBadges';
import { useDocumentUpload } from '../hooks';
import type { VerificationResult } from '@domain/entities';

function Spinner() {
  return (
    <svg
      className="animate-spin h-8 w-8 text-primary-600 motion-reduce:animate-none"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

const FIELD_LABELS: Record<string, string> = {
  nombre_parts: 'Nombre de parts',
  reference_avis: "Référence de l'avis",
  date_mise_recouvrement: 'Date de mise en recouvrement',
  nom: 'Nom',
  prenom: 'Prénom',
  adresse: 'Adresse',
  date_naissance: 'Date de naissance',
  numero_fiscal: 'Numéro fiscal',
  revenu_fiscal_reference: 'Revenu fiscal de référence',
  annee_revenus: 'Année des revenus',
  situation_famille: 'Situation familiale',
  montant_impot: "Montant de l'impôt",
  date_etablissement: "Date d'établissement",
  numero_siren: 'Numéro SIREN',
  numero_siret: 'Numéro SIRET',
  raison_sociale: 'Raison sociale',
  forme_juridique: 'Forme juridique',
  date_creation: 'Date de création',
  capital_social: 'Capital social',
  effectif: 'Effectif',
  code_naf: 'Code NAF',
  activite: 'Activité',
};

function getFieldLabel(key: string): string {
  return FIELD_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

type TrustLevelStyle = 'high' | 'medium' | 'invalid' | 'low';

function getTrustLevelStyle(trustLevel: string, verdict: string): TrustLevelStyle {
  if (verdict === 'invalid') return 'invalid';
  if (trustLevel === 'high' && verdict === 'valid') return 'high';
  if (trustLevel === 'medium') return 'medium';
  return 'low';
}

function getTrustLevelInfo(trustLevel: string, verdict: string) {
  const style = getTrustLevelStyle(trustLevel, verdict);

  switch (style) {
    case 'high':
      return {
        style: 'high' as const,
        title: 'Signature cryptographique vérifiée',
        subtitle:
          'Signature ECDSA validée à partir des certificats publics officiels (ANTS – 2D-Doc)',
        borderColor: 'border-green-700',
        textColor: 'text-green-700',
        iconBgColor: 'bg-green-50',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ),
      };
    case 'invalid':
      return {
        style: 'invalid' as const,
        title: 'Signature cryptographique invalide',
        subtitle: 'La signature ne correspond pas aux certificats de confiance connus',
        borderColor: 'border-red-800',
        textColor: 'text-red-800',
        iconBgColor: 'bg-red-50',
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        ),
      };
    case 'medium':
      return {
        style: 'medium' as const,
        title: 'Format 2D-Doc détecté',
        subtitle: 'Structure du document reconnue comme compatible avec le standard 2D-Doc (ANTS).',
        borderColor: 'border-transparent', // Pas de bordure pour MEDIUM
        textColor: 'text-primary-700',
        iconBgColor: 'bg-primary-50',
        // Icône œil/vigilance (observation, pas validation)
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        ),
      };
    default:
      return {
        style: 'low' as const,
        title: 'Format non reconnu',
        subtitle: "Ce document n'a pas pu être identifié.",
        borderColor: 'border-gray-400',
        textColor: 'text-gray-500',
        iconBgColor: 'bg-gray-50',
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ),
      };
  }
}

function CollapsibleSection({
  title,
  bgColor,
  textColor,
  children,
}: {
  title: string;
  bgColor: string;
  textColor: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group">
      <summary
        className={`flex items-center justify-between cursor-pointer p-4 ${bgColor} rounded-lg hover:opacity-90 transition-opacity`}
      >
        <span className={`text-sm font-medium ${textColor}`}>{title}</span>
        <svg
          className={`w-5 h-5 ${textColor} group-open:rotate-180 transition-transform`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className={`mt-2 p-4 ${bgColor} rounded-lg`}>{children}</div>
    </details>
  );
}

function ResultDisplay({ result, onReset }: { result: VerificationResult; onReset: () => void }) {
  const levelInfo = getTrustLevelInfo(result.trustLevel, result.verdict);
  const hasExtractedFields = Object.keys(result.extractedFields).length > 0;

  // Background adapté selon le niveau
  const getVerdictBackground = () => {
    if (levelInfo.style === 'medium') return 'bg-gray-50'; // Fond neutre pour MEDIUM
    return 'bg-white';
  };

  return (
    <div className="space-y-4">
      {/* Verdict principal */}
      <div
        className={`text-center p-6 rounded-xl border-2 ${getVerdictBackground()} ${levelInfo.borderColor}`}
      >
        <div className="mb-4">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${levelInfo.iconBgColor}`}
          >
            <svg
              className={`w-8 h-8 ${levelInfo.textColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {levelInfo.icon}
            </svg>
          </div>
        </div>
        <h3 className={`text-xl font-semibold mb-1 ${levelInfo.textColor}`}>{levelInfo.title}</h3>
        <p className="text-sm text-gray-500">{levelInfo.subtitle}</p>
      </div>

      {/* Disclaimer légal - toujours visible */}
      <p className="text-xs text-gray-500 text-center leading-relaxed">
        Cette analyse atteste de la structure et, le cas échéant, de l&apos;intégrité
        cryptographique du document. Elle ne constitue pas une validation administrative ou
        juridique.
      </p>

      {/* Bloc crypto - uniquement pour HIGH */}
      {levelInfo.style === 'high' && (
        <div className="border border-green-200 rounded-lg p-4 bg-green-50/50">
          <h4 className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-3">
            Informations cryptographiques
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Algorithme</span>
              <span className="font-medium text-green-900">ECDSA P-256</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Source</span>
              <span className="font-medium text-green-900">ANTS (2D-Doc)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Consulté le</span>
              <span className="font-medium text-green-900">
                {new Date(result.verifiedAt).toLocaleDateString('fr-FR')}{' '}
                {new Date(result.verifiedAt).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Limites et points d'attention - pour MEDIUM */}
      {levelInfo.style === 'medium' && (
        <div className="border border-amber-200 rounded-lg p-4 bg-amber-50/50">
          <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3">
            Limites et points d&apos;attention
          </h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong className="block mb-1">
              Aucune signature cryptographique vérifiable n&apos;a été détectée à ce stade.
            </strong>
            La structure du document est compatible avec le standard 2D-Doc, mais son intégrité
            cryptographique n&apos;a pas pu être confirmée à partir des certificats disponibles.
          </p>
        </div>
      )}

      {/* Infos principales */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Type de document</span>
          <span className="font-medium text-gray-900">
            {result.documentTypeLabel || 'Non catégorisé'}
          </span>
        </div>
        {result.issuer && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Émetteur détecté</span>
            <span className="font-medium text-gray-900">{result.issuer}</span>
          </div>
        )}
        {result.emissionDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date d&apos;émission</span>
            <span className="font-medium text-gray-900">{result.emissionDate}</span>
          </div>
        )}
      </div>

      {/* Avertissements */}
      {result.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <ul className="text-sm text-amber-700 space-y-1">
            {result.warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Erreur */}
      {result.failureReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{result.failureReason}</p>
        </div>
      )}

      {/* Informations extraites (repliable) */}
      {hasExtractedFields && (
        <CollapsibleSection
          title="Informations extraites"
          bgColor="bg-blue-50"
          textColor="text-blue-800"
        >
          <div className="space-y-2">
            {Object.entries(result.extractedFields).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm gap-4">
                <span className="text-blue-600">{getFieldLabel(key)}</span>
                <span className="font-medium text-blue-900 text-right break-all">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-500 mt-3 pt-3 border-t border-blue-200">
            Informations extraites automatiquement, à titre informatif.
          </p>
        </CollapsibleSection>
      )}

      {/* Métadonnées techniques (repliable) - ordre strict aligné extension */}
      <CollapsibleSection
        title="Métadonnées techniques"
        bgColor="bg-gray-100"
        textColor="text-gray-700"
      >
        <div className="space-y-2 text-sm">
          {/* 1. Type de document */}
          <div className="flex justify-between">
            <span className="text-gray-500">Type de document</span>
            <span className="font-medium text-gray-900">
              {result.documentTypeLabel || result.detectedType || 'Non spécifié'}
            </span>
          </div>
          {/* 2. Émetteur détecté */}
          <div className="flex justify-between">
            <span className="text-gray-500">Émetteur détecté</span>
            <span className="font-medium text-gray-900">{result.issuer || 'Non spécifié'}</span>
          </div>
          {/* 3. Consulté le */}
          <div className="flex justify-between">
            <span className="text-gray-500">Consulté le</span>
            <span className="font-medium text-gray-900">
              {new Date(result.verifiedAt).toLocaleDateString('fr-FR')}{' '}
              {new Date(result.verifiedAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          {/* 4. Méthode de détection */}
          <div className="flex justify-between">
            <span className="text-gray-500">Méthode de détection</span>
            <span className="font-medium text-gray-900">Lecture 2D-Doc</span>
          </div>
          {/* 5. Certificats ANTS (si applicable - HIGH uniquement) */}
          {levelInfo.style === 'high' && (
            <div className="flex justify-between">
              <span className="text-gray-500">Certificats ANTS</span>
              <span className="font-medium text-gray-900">À jour</span>
            </div>
          )}
          {/* Séparateur fichier analysé */}
          {result.file && (
            <>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-400 text-xs">Fichier analysé</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nom</span>
                <span className="font-medium text-gray-900 text-right break-all max-w-[60%]">
                  {result.file.filename}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-mono text-gray-900">{result.file.contentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taille</span>
                <span className="font-medium text-gray-900">
                  {(result.file.sizeBytes / 1024).toFixed(1)} Ko
                </span>
              </div>
            </>
          )}
          {result.failureCode && (
            <div className="flex justify-between">
              <span className="text-gray-500">Code erreur</span>
              <span className="font-mono text-red-600">{result.failureCode}</span>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Vérification en ligne */}
      {result.requiresOnlineVerification && result.onlineVerificationUrl && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800 mb-2">
            Ce document nécessite une vérification complémentaire en ligne.
          </p>
          <a
            href={result.onlineVerificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-amber-700 underline hover:text-amber-900"
          >
            Vérifier sur le site officiel
          </a>
        </div>
      )}

      {/* CTA unique */}
      <button
        type="button"
        onClick={onReset}
        className="w-full py-3 px-4 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
      >
        Nouvelle vérification
      </button>
    </div>
  );
}

export function UploadCard() {
  const { status, selectedFile, error, result, selectFile, reset } = useDocumentUpload();

  const isProcessing = status === 'uploading' || status === 'processing';

  const getStatusMessage = (): string | null => {
    switch (status) {
      case 'uploading':
        return 'Téléversement en cours…';
      case 'processing':
        return 'Analyse du document…';
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  // Show result if verification succeeded
  if (status === 'success' && result) {
    return (
      <div className="w-full max-w-[640px] mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Résultat de la vérification
            </h2>
          </div>
          <ResultDisplay result={result} onReset={reset} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[640px] mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Vous avez déjà un document ?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Déposez-le pour vérifier son authenticité.
          </p>
        </div>

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center min-h-[100px] py-4">
            <Spinner />
            <p className="mt-4 text-sm font-medium text-gray-700" aria-live="polite">
              {statusMessage}
            </p>
            {selectedFile && <p className="mt-2 text-xs text-gray-500">{selectedFile.name}</p>}
          </div>
        ) : (
          <div className="mb-6">
            <DocumentDropZone
              onFileSelect={selectFile}
              selectedFile={selectedFile}
              isDisabled={false}
            />
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-red-800">{error}</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        <FeatureBadges />
      </div>
    </div>
  );
}
