import { describe, it, expect } from 'vitest';
import { VERDICTS, isValidVerdict } from '../Verdict';

describe('Verdict', () => {
  describe('VERDICTS', () => {
    it('should contain valid, invalid, and indeterminate', () => {
      expect(VERDICTS).toContain('valid');
      expect(VERDICTS).toContain('invalid');
      expect(VERDICTS).toContain('indeterminate');
      expect(VERDICTS.length).toBe(3);
    });
  });

  describe('isValidVerdict', () => {
    it('should return true for valid verdicts', () => {
      expect(isValidVerdict('valid')).toBe(true);
      expect(isValidVerdict('invalid')).toBe(true);
      expect(isValidVerdict('indeterminate')).toBe(true);
    });

    it('should return false for invalid verdicts', () => {
      expect(isValidVerdict('unknown')).toBe(false);
      expect(isValidVerdict('')).toBe(false);
      expect(isValidVerdict('VALID')).toBe(false);
    });
  });
});
