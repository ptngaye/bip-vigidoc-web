'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DocumentDropZone } from './DocumentDropZone';
import { FeatureBadges } from './FeatureBadges';
import { useDocumentUpload } from '../hooks';

function Spinner() {
  return (
    <svg
      className="animate-spin h-8 w-8 text-primary-600 motion-reduce:animate-none"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function UploadCard() {
  const router = useRouter();
  const { status, selectedFile, error, result, selectFile, reset } =
    useDocumentUpload();

  const isProcessing = status === 'uploading' || status === 'processing';

  useEffect(() => {
    if (status === 'success' && result) {
      router.push(`/resultat/${result.verificationId}`);
    }
  }, [status, result, router]);

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
          <div className="flex flex-col items-center justify-center min-h-[200px] py-8">
            <Spinner />
            <p
              className="mt-4 text-sm font-medium text-gray-700"
              aria-live="polite"
            >
              {statusMessage}
            </p>
            {selectedFile && (
              <p className="mt-2 text-xs text-gray-500">{selectedFile.name}</p>
            )}
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
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
          >
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
