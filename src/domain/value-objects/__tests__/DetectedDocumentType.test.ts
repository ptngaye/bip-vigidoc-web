import { describe, it, expect } from 'vitest';
import { DETECTED_DOCUMENT_TYPES, isValidDetectedDocumentType } from '../DetectedDocumentType';

describe('DetectedDocumentType', () => {
  describe('DETECTED_DOCUMENT_TYPES', () => {
    it('should contain all document types', () => {
      expect(DETECTED_DOCUMENT_TYPES).toContain('signed_2d_doc');
      expect(DETECTED_DOCUMENT_TYPES).toContain('kbis_infogreffe');
      expect(DETECTED_DOCUMENT_TYPES).toContain('urssaf_code');
      expect(DETECTED_DOCUMENT_TYPES).toContain('unknown');
      expect(DETECTED_DOCUMENT_TYPES.length).toBe(4);
    });
  });

  describe('isValidDetectedDocumentType', () => {
    it('should return true for valid document types', () => {
      expect(isValidDetectedDocumentType('signed_2d_doc')).toBe(true);
      expect(isValidDetectedDocumentType('kbis_infogreffe')).toBe(true);
      expect(isValidDetectedDocumentType('urssaf_code')).toBe(true);
      expect(isValidDetectedDocumentType('unknown')).toBe(true);
    });

    it('should return false for invalid document types', () => {
      expect(isValidDetectedDocumentType('invalid')).toBe(false);
      expect(isValidDetectedDocumentType('')).toBe(false);
    });
  });
});
