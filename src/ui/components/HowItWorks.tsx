const STEPS = [
  {
    number: 1,
    title: 'Déposez votre document',
    description: 'PDF ou image (JPG, PNG)',
  },
  {
    number: 2,
    title: 'Analyse automatique',
    description: 'Vérification des éléments de sécurité',
  },
  {
    number: 3,
    title: 'Résultat clair',
    description: 'Rapport détaillé et recommandations',
  },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" aria-labelledby="how-it-works-title">
      <h2 id="how-it-works-title" className="text-xl font-semibold text-gray-900 text-center mb-8">
        Comment ça marche ?
      </h2>

      <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {STEPS.map(step => (
          <li key={step.number} className="flex flex-col items-center text-center p-4">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-semibold text-lg mb-3"
              aria-hidden="true"
            >
              {step.number}
            </span>
            <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
            <p className="text-sm text-gray-500">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
