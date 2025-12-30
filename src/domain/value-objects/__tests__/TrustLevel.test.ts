import { describe, it, expect } from 'vitest';
import { TRUST_LEVELS, isValidTrustLevel } from '../TrustLevel';

describe('TrustLevel', () => {
  describe('TRUST_LEVELS', () => {
    it('should contain high, medium, and low', () => {
      expect(TRUST_LEVELS).toContain('high');
      expect(TRUST_LEVELS).toContain('medium');
      expect(TRUST_LEVELS).toContain('low');
      expect(TRUST_LEVELS.length).toBe(3);
    });
  });

  describe('isValidTrustLevel', () => {
    it('should return true for valid trust levels', () => {
      expect(isValidTrustLevel('high')).toBe(true);
      expect(isValidTrustLevel('medium')).toBe(true);
      expect(isValidTrustLevel('low')).toBe(true);
    });

    it('should return false for invalid trust levels', () => {
      expect(isValidTrustLevel('unknown')).toBe(false);
      expect(isValidTrustLevel('')).toBe(false);
      expect(isValidTrustLevel('HIGH')).toBe(false);
    });
  });
});
