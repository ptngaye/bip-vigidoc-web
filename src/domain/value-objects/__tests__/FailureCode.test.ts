import { describe, it, expect } from 'vitest';
import { FAILURE_CODES, isValidFailureCode } from '../FailureCode';

describe('FailureCode', () => {
  describe('FAILURE_CODES', () => {
    it('should contain all failure codes', () => {
      expect(FAILURE_CODES).toContain('NO_2D_DOC');
      expect(FAILURE_CODES).toContain('PARSE_ERROR');
      expect(FAILURE_CODES).toContain('UNSUPPORTED_VERSION');
      expect(FAILURE_CODES).toContain('CERT_UNKNOWN');
      expect(FAILURE_CODES).toContain('CERT_REVOKED');
      expect(FAILURE_CODES).toContain('CERT_EXPIRED');
      expect(FAILURE_CODES).toContain('BAD_SIGNATURE');
      expect(FAILURE_CODES).toContain('ONLINE_VERIFICATION_REQUIRED');
      expect(FAILURE_CODES).toContain('UNKNOWN_DOCUMENT');
      expect(FAILURE_CODES.length).toBe(9);
    });
  });

  describe('isValidFailureCode', () => {
    it('should return true for valid failure codes', () => {
      expect(isValidFailureCode('NO_2D_DOC')).toBe(true);
      expect(isValidFailureCode('BAD_SIGNATURE')).toBe(true);
      expect(isValidFailureCode('ONLINE_VERIFICATION_REQUIRED')).toBe(true);
    });

    it('should return false for invalid failure codes', () => {
      expect(isValidFailureCode('INVALID_CODE')).toBe(false);
      expect(isValidFailureCode('')).toBe(false);
    });
  });
});
