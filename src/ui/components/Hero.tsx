import Link from 'next/link';

export function Hero() {
  return (
    <section className="text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">BIP VigiDoc</h1>
      <p className="text-lg text-gray-600 mb-4">
        Vérification de documents administratifs français
      </p>
      <p className="text-sm text-gray-500">
        Analyse automatique, sans compte.{' '}
        <Link
          href="#comment-ca-marche"
          className="text-primary-600 hover:text-primary-700 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
        >
          Comment ça marche ?
        </Link>
      </p>
    </section>
  );
}
