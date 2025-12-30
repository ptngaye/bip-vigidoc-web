import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[960px] px-6 sm:px-10 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © 2025 BIP Tech — Bureau Informatique des PME, TPE et Indépendants. Tous droits réservés.
          </p>

          <nav aria-label="Liens légaux">
            <ul className="flex items-center gap-4">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded px-1 py-0.5"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <span className="text-gray-300" aria-hidden="true">|</span>
              </li>
              <li>
                <Link
                  href="/accessibilite"
                  className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded px-1 py-0.5"
                >
                  Accessibilité
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
