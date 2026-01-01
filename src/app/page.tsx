import { Hero, UploadCard, HowItWorks, AcceptedDocuments } from '@ui/components';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[960px] px-6 sm:px-10 py-8 sm:py-12">
      <div className="space-y-12 sm:space-y-16">
        <Hero />

        <UploadCard />

        <HowItWorks />

        <AcceptedDocuments />
      </div>
    </main>
  );
}
