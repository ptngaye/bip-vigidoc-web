'use client';

import { DocumentDropZone } from './DocumentDropZone';
import { FeatureBadges } from './FeatureBadges';
import { useDocumentUpload } from '../hooks';

export function UploadCard() {
  const { status, selectedFile, error, selectFile, upload, reset } =
    useDocumentUpload();

  const isUploading = status === 'uploading';

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Vous avez déjà un document ?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Vérifiez l&apos;authenticité d&apos;un document administratif français.
          </p>
        </div>

        <div className="mb-6">
          <DocumentDropZone
            onFileSelect={selectFile}
            selectedFile={selectedFile}
            isDisabled={isUploading}
          />
        </div>

        {selectedFile && status !== 'success' && (
          <div className="mb-6">
            <button
              type="button"
              onClick={upload}
              disabled={isUploading}
              className={`
                w-full py-3 px-4 rounded-lg font-medium text-white
                transition-all duration-200
                ${
                  isUploading
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
                }
              `}
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Analyse en cours...
                </span>
              ) : (
                'Vérifier le document'
              )}
            </button>
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
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
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
