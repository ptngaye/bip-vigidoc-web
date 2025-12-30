export const VERDICTS = ['valid', 'invalid', 'indeterminate'] as const;

export type Verdict = (typeof VERDICTS)[number];

export function isValidVerdict(value: string): value is Verdict {
  return VERDICTS.includes(value as Verdict);
}
