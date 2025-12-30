import { UploadCard } from '@ui/components';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            BIP VigiDoc
          </h1>
          <p className="text-gray-600">
            Vérification de documents administratifs français
          </p>
        </header>

        <UploadCard />

        <footer className="mt-8 text-center text-xs text-gray-400">
          <p>Service de vérification sécurisé</p>
        </footer>
      </div>
    </main>
  );
}
