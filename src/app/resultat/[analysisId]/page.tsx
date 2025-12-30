import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Résultat de vérification - BIP VigiDoc',
  description: "Résultat de l'analyse de votre document administratif.",
};

interface ResultPageProps {
  params: Promise<{ analysisId: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { analysisId } = await params;

  return (
    <main className="mx-auto max-w-[960px] px-6 sm:px-10 py-8 sm:py-12">
      <div className="max-w-[640px] mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Résultat de vérification
            </h1>
            <p className="text-sm text-gray-500">
              ID de vérification : {analysisId}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-amber-800">
                  Cette page sera enrichie avec les détails de l&apos;analyse une fois la persistance des résultats implémentée.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                <span className="font-medium text-gray-900">
                  Contrôles effectués
                </span>
                <svg
                  className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="p-4 text-sm text-gray-600">
                <p>Les détails des contrôles seront affichés ici.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                <span className="font-medium text-gray-900">
                  Recommandations
                </span>
                <svg
                  className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="p-4 text-sm text-gray-600">
                <p>Les recommandations seront affichées ici.</p>
              </div>
            </details>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 py-3 px-4 text-center rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors motion-reduce:transition-none"
            >
              Analyser un autre document
            </Link>
            <Link
              href="/aide"
              className="flex-1 py-3 px-4 text-center rounded-lg font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors motion-reduce:transition-none"
            >
              Demander de l&apos;aide
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
