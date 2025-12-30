export const DOCUMENT_FAMILIES = [
  'urssaf',
  'impots',
  'identite',
  'energie',
  'entreprise',
  'unknown',
] as const;

export type DocumentFamily = (typeof DOCUMENT_FAMILIES)[number];

export function isValidDocumentFamily(value: string): value is DocumentFamily {
  return DOCUMENT_FAMILIES.includes(value as DocumentFamily);
}
