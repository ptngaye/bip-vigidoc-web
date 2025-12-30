import { describe, it, expect } from 'vitest';
import { VerificationResult, type VerificationResultProps } from '../VerificationResult';

function createValidResultProps(overrides: Partial<VerificationResultProps> = {}): VerificationResultProps {
  return {
    verificationId: 'test-uuid',
    verdict: 'valid',
    detectedType: 'signed_2d_doc',
    trustLevel: 'high',
    requiresOnlineVerification: false,
    onlineVerificationUrl: null,
    documentType: 'attestation_urssaf',
    documentTypeLabel: 'Attestation URSSAF',
    documentFamily: 'urssaf',
    emissionDate: '2024-01-15',
    issuer: 'URSSAF',
    extractedFields: { SIREN: '123456789' },
    failureCode: null,
    failureReason: null,
    warnings: [],
    file: {
      filename: 'document.pdf',
      contentType: 'application/pdf',
      sizeBytes: 1024,
    },
    verifiedAt: '2024-12-30T10:00:00Z',
    ...overrides,
  };
}

describe('VerificationResult', () => {
  describe('create', () => {
    it('should create a valid VerificationResult', () => {
      const props = createValidResultProps();
      const result = VerificationResult.create(props);

      expect(result.verificationId).toBe('test-uuid');
      expect(result.verdict).toBe('valid');
      expect(result.detectedType).toBe('signed_2d_doc');
      expect(result.trustLevel).toBe('high');
    });
  });

  describe('verdict helpers', () => {
    it('should return true for isValid when verdict is valid', () => {
      const result = VerificationResult.create(createValidResultProps({ verdict: 'valid' }));
      expect(result.isValid).toBe(true);
      expect(result.isInvalid).toBe(false);
      expect(result.isIndeterminate).toBe(false);
    });

    it('should return true for isInvalid when verdict is invalid', () => {
      const result = VerificationResult.create(createValidResultProps({ verdict: 'invalid' }));
      expect(result.isValid).toBe(false);
      expect(result.isInvalid).toBe(true);
      expect(result.isIndeterminate).toBe(false);
    });

    it('should return true for isIndeterminate when verdict is indeterminate', () => {
      const result = VerificationResult.create(createValidResultProps({ verdict: 'indeterminate' }));
      expect(result.isValid).toBe(false);
      expect(result.isInvalid).toBe(false);
      expect(result.isIndeterminate).toBe(true);
    });
  });

  describe('trust level helpers', () => {
    it('should return true for hasHighTrust when trust level is high', () => {
      const result = VerificationResult.create(createValidResultProps({ trustLevel: 'high' }));
      expect(result.hasHighTrust).toBe(true);
      expect(result.hasMediumTrust).toBe(false);
      expect(result.hasLowTrust).toBe(false);
    });

    it('should return true for hasMediumTrust when trust level is medium', () => {
      const result = VerificationResult.create(createValidResultProps({ trustLevel: 'medium' }));
      expect(result.hasHighTrust).toBe(false);
      expect(result.hasMediumTrust).toBe(true);
      expect(result.hasLowTrust).toBe(false);
    });

    it('should return true for hasLowTrust when trust level is low', () => {
      const result = VerificationResult.create(createValidResultProps({ trustLevel: 'low' }));
      expect(result.hasHighTrust).toBe(false);
      expect(result.hasMediumTrust).toBe(false);
      expect(result.hasLowTrust).toBe(true);
    });
  });

  describe('getters', () => {
    it('should return all properties correctly', () => {
      const props = createValidResultProps({
        requiresOnlineVerification: true,
        onlineVerificationUrl: 'https://verify.example.com',
        failureCode: 'ONLINE_VERIFICATION_REQUIRED',
        failureReason: 'Verification required',
        warnings: ['Warning 1', 'Warning 2'],
      });

      const result = VerificationResult.create(props);

      expect(result.requiresOnlineVerification).toBe(true);
      expect(result.onlineVerificationUrl).toBe('https://verify.example.com');
      expect(result.documentType).toBe('attestation_urssaf');
      expect(result.documentTypeLabel).toBe('Attestation URSSAF');
      expect(result.documentFamily).toBe('urssaf');
      expect(result.emissionDate).toBe('2024-01-15');
      expect(result.issuer).toBe('URSSAF');
      expect(result.failureCode).toBe('ONLINE_VERIFICATION_REQUIRED');
      expect(result.failureReason).toBe('Verification required');
      expect(result.verifiedAt).toBe('2024-12-30T10:00:00Z');
    });

    it('should return a copy of extractedFields', () => {
      const props = createValidResultProps({ extractedFields: { key: 'value' } });
      const result = VerificationResult.create(props);

      const fields = result.extractedFields;
      fields['newKey'] = 'newValue';

      expect(result.extractedFields).not.toHaveProperty('newKey');
    });

    it('should return a copy of warnings', () => {
      const props = createValidResultProps({ warnings: ['warning1'] });
      const result = VerificationResult.create(props);

      const warnings = result.warnings;
      warnings.push('warning2');

      expect(result.warnings).toHaveLength(1);
    });

    it('should return file metadata', () => {
      const result = VerificationResult.create(createValidResultProps());

      expect(result.file).toEqual({
        filename: 'document.pdf',
        contentType: 'application/pdf',
        sizeBytes: 1024,
      });
    });

    it('should return null for file when not provided', () => {
      const result = VerificationResult.create(createValidResultProps({ file: null }));
      expect(result.file).toBeNull();
    });
  });
});
