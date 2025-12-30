import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[960px] px-6 sm:px-10">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold text-gray-900 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          >
            BIP VigiDoc
          </Link>

          <nav aria-label="Navigation principale">
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  href="/aide"
                  className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded px-1 py-0.5"
                >
                  Aide
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded px-1 py-0.5"
                >
                  Confidentialité
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
