import Link from 'next/link';

const TIPS = [
  'Document à plat',
  'Bonne lumière',
  'Bords visibles',
  'Éviter reflets et ombres',
];

export function AcceptedDocuments() {
  return (
    <section aria-labelledby="accepted-docs-title" className="bg-gray-50 rounded-xl p-6">
      <h2
        id="accepted-docs-title"
        className="text-lg font-semibold text-gray-900 mb-4"
      >
        Documents acceptés
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Formats & limites</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              <span className="font-medium">Formats :</span> PDF, JPG, PNG
            </li>
            <li>
              <span className="font-medium">Taille max :</span> 10 Mo
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Conseils pour une bonne photo</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {TIPS.map((tip) => (
              <li key={tip} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/aide#photo"
          className="inline-block text-sm text-primary-600 hover:text-primary-700 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
        >
          Conseils pour une photo réussie
        </Link>
      </div>
    </section>
  );
}
