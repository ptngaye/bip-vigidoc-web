export const FAILURE_CODES = [
  'NO_2D_DOC',
  'PARSE_ERROR',
  'UNSUPPORTED_VERSION',
  'CERT_UNKNOWN',
  'CERT_REVOKED',
  'CERT_EXPIRED',
  'BAD_SIGNATURE',
  'ONLINE_VERIFICATION_REQUIRED',
  'UNKNOWN_DOCUMENT',
] as const;

export type FailureCode = (typeof FAILURE_CODES)[number];

export function isValidFailureCode(value: string): value is FailureCode {
  return FAILURE_CODES.includes(value as FailureCode);
}
