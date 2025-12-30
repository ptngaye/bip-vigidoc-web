interface Feature {
  label: string;
}

const FEATURES: Feature[] = [
  { label: 'Analyse automatique' },
  { label: 'Sans inscription' },
  { label: 'Gratuit' },
];

export function FeatureBadges() {
  return (
    <ul className="flex flex-wrap justify-center gap-3" aria-label="Avantages du service">
      {FEATURES.map((feature) => (
        <li key={feature.label} className="flex items-center gap-1.5">
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
          <span className="text-sm text-gray-600">{feature.label}</span>
        </li>
      ))}
    </ul>
  );
}
