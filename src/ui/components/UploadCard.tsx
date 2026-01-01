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

function VerdictBadge({ verdict }: { verdict: string }) {
  const config = {
    valid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Document valide' },
    invalid: { bg: 'bg-red-100', text: 'text-red-800', label: 'Document invalide' },
    indeterminate: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Vérification incomplète' },
  }[verdict] || { bg: 'bg-gray-100', text: 'text-gray-800', label: verdict };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

function TrustBadge({ level }: { level: string }) {
  const config = {
    high: { bg: 'bg-green-50', text: 'text-green-700', label: 'Confiance élevée' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Confiance moyenne' },
    low: { bg: 'bg-red-50', text: 'text-red-700', label: 'Confiance faible' },
  }[level] || { bg: 'bg-gray-50', text: 'text-gray-700', label: level };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

function ResultDisplay({ result, onReset }: { result: VerificationResult; onReset: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4">
          {result.verdict === 'valid' ? (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : result.verdict === 'invalid' ? (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100">
              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          )}
        </div>
        <VerdictBadge verdict={result.verdict} />
        <div className="mt-2">
          <TrustBadge level={result.trustLevel} />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        {result.documentTypeLabel && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Type de document</span>
            <span className="font-medium text-gray-900">{result.documentTypeLabel}</span>
          </div>
        )}
        {result.issuer && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Émetteur</span>
            <span className="font-medium text-gray-900">{result.issuer}</span>
          </div>
        )}
        {result.documentFamily && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Famille</span>
            <span className="font-medium text-gray-900">{result.documentFamily}</span>
          </div>
        )}
        {result.file && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fichier</span>
            <span className="font-medium text-gray-900">{result.file.filename}</span>
          </div>
        )}
      </div>

      {Object.keys(result.extractedFields).length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-3">Données extraites</h4>
          <div className="space-y-2">
            {Object.entries(result.extractedFields).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-blue-600">{key.replace(/_/g, ' ')}</span>
                <span className="font-medium text-blue-900 text-right max-w-[60%] break-all">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-amber-800 mb-2">Avertissements</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            {result.warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {result.failureReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Raison de l&apos;échec</h4>
          <p className="text-sm text-red-700">{result.failureReason}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="w-full py-3 px-4 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
      >
        Vérifier un autre document
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
