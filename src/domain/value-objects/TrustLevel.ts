export const TRUST_LEVELS = ['high', 'medium', 'low'] as const;

export type TrustLevel = (typeof TRUST_LEVELS)[number];

export function isValidTrustLevel(value: string): value is TrustLevel {
  return TRUST_LEVELS.includes(value as TrustLevel);
}
