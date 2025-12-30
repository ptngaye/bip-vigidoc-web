export const DETECTED_DOCUMENT_TYPES = [
  'signed_2d_doc',
  'kbis_infogreffe',
  'urssaf_code',
  'unknown',
] as const;

export type DetectedDocumentType = (typeof DETECTED_DOCUMENT_TYPES)[number];

export function isValidDetectedDocumentType(value: string): value is DetectedDocumentType {
  return DETECTED_DOCUMENT_TYPES.includes(value as DetectedDocumentType);
}
