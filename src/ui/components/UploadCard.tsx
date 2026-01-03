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

function getVerdictInfo(verdict: string) {
  switch (verdict) {
    case 'valid':
      return {
        title: 'Document authentique',
        subtitle: 'Signature cryptographique valide',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ),
      };
    case 'invalid':
      return {
        title: 'Document non authentique',
        subtitle: 'Signature invalide',
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ),
      };
    default:
      return {
        title: 'Authenticité non déterminable',
        subtitle: 'Signature non vérifiable',
        bgColor: 'bg-amber-100',
        iconColor: 'text-amber-600',
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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
  const verdictInfo = getVerdictInfo(result.verdict);
  const hasExtractedFields = Object.keys(result.extractedFields).length > 0;

  return (
    <div className="space-y-4">
      {/* Verdict principal */}
      <div className="text-center">
        <div className="mb-4">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${verdictInfo.bgColor}`}
          >
            <svg
              className={`w-8 h-8 ${verdictInfo.iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {verdictInfo.icon}
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{verdictInfo.title}</h3>
        <p className="text-sm text-gray-500">{verdictInfo.subtitle}</p>
      </div>

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
            <span className="text-gray-500">Émetteur</span>
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

      {/* Données extraites (repliable) */}
      {hasExtractedFields && (
        <CollapsibleSection
          title="Données extraites"
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

      {/* Détails techniques (repliable) */}
      <CollapsibleSection
        title="Détails techniques"
        bgColor="bg-gray-100"
        textColor="text-gray-700"
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">ID de vérification</span>
            <span className="font-mono text-gray-900 text-xs">{result.verificationId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Verdict</span>
            <span className="font-medium text-gray-900">{result.verdict}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Niveau de confiance</span>
            <span className="font-medium text-gray-900">{result.trustLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Type détecté</span>
            <span className="font-medium text-gray-900">{result.detectedType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Famille</span>
            <span className="font-medium text-gray-900">{result.documentFamily}</span>
          </div>
          {result.documentType && (
            <div className="flex justify-between">
              <span className="text-gray-500">Code type</span>
              <span className="font-mono text-gray-900">{result.documentType}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Vérifié à</span>
            <span className="font-medium text-gray-900">
              {new Date(result.verifiedAt).toLocaleString('fr-FR')}
            </span>
          </div>
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
