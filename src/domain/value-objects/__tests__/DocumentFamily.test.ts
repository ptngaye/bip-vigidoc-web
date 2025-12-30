import { describe, it, expect } from 'vitest';
import { DOCUMENT_FAMILIES, isValidDocumentFamily } from '../DocumentFamily';

describe('DocumentFamily', () => {
  describe('DOCUMENT_FAMILIES', () => {
    it('should contain all document families', () => {
      expect(DOCUMENT_FAMILIES).toContain('urssaf');
      expect(DOCUMENT_FAMILIES).toContain('impots');
      expect(DOCUMENT_FAMILIES).toContain('identite');
      expect(DOCUMENT_FAMILIES).toContain('energie');
      expect(DOCUMENT_FAMILIES).toContain('entreprise');
      expect(DOCUMENT_FAMILIES).toContain('unknown');
      expect(DOCUMENT_FAMILIES.length).toBe(6);
    });
  });

  describe('isValidDocumentFamily', () => {
    it('should return true for valid families', () => {
      expect(isValidDocumentFamily('urssaf')).toBe(true);
      expect(isValidDocumentFamily('impots')).toBe(true);
      expect(isValidDocumentFamily('identite')).toBe(true);
      expect(isValidDocumentFamily('energie')).toBe(true);
      expect(isValidDocumentFamily('entreprise')).toBe(true);
      expect(isValidDocumentFamily('unknown')).toBe(true);
    });

    it('should return false for invalid families', () => {
      expect(isValidDocumentFamily('invalid')).toBe(false);
      expect(isValidDocumentFamily('')).toBe(false);
    });
  });
});
