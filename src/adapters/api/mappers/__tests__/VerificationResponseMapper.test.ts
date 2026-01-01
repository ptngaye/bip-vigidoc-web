import { describe, it, expect } from 'vitest';
import {
  VerificationResponseMapper,
  type ApiVerificationResponse,
} from '../VerificationResponseMapper';

function createMockApiResponse(
  overrides: Partial<ApiVerificationResponse> = {}
): ApiVerificationResponse {
  return {
    verification_id: 'test-uuid',
    verdict: 'valid',
    detected_type: 'signed_2d_doc',
    trust_level: 'high',
    requires_online_verification: false,
    online_verification_url: null,
    document_type: 'attestation_urssaf',
    document_type_label: 'Attestation URSSAF',
    document_family: 'urssaf',
    emission_date: '2024-01-15',
    issuer: 'URSSAF',
    extracted_fields: { SIREN: '123456789' },
    failure_code: null,
    failure_reason: null,
    warnings: ['warning1'],
    file: {
      filename: 'test.pdf',
      content_type: 'application/pdf',
      size_bytes: 1024,
    },
    verified_at: '2024-12-30T10:00:00Z',
    ...overrides,
  };
}

describe('VerificationResponseMapper', () => {
  describe('toDomain', () => {
    it('should map all fields correctly', () => {
      const apiResponse = createMockApiResponse();
      const result = VerificationResponseMapper.toDomain(apiResponse);

      expect(result.verificationId).toBe('test-uuid');
      expect(result.verdict).toBe('valid');
      expect(result.detectedType).toBe('signed_2d_doc');
      expect(result.trustLevel).toBe('high');
      expect(result.requiresOnlineVerification).toBe(false);
      expect(result.onlineVerificationUrl).toBeNull();
      expect(result.documentType).toBe('attestation_urssaf');
      expect(result.documentTypeLabel).toBe('Attestation URSSAF');
      expect(result.documentFamily).toBe('urssaf');
      expect(result.emissionDate).toBe('2024-01-15');
      expect(result.issuer).toBe('URSSAF');
      expect(result.extractedFields).toEqual({ SIREN: '123456789' });
      expect(result.failureCode).toBeNull();
      expect(result.failureReason).toBeNull();
      expect(result.warnings).toEqual(['warning1']);
      expect(result.verifiedAt).toBe('2024-12-30T10:00:00Z');
    });

    it('should map file metadata correctly', () => {
      const apiResponse = createMockApiResponse();
      const result = VerificationResponseMapper.toDomain(apiResponse);

      expect(result.file).toEqual({
        filename: 'test.pdf',
        contentType: 'application/pdf',
        sizeBytes: 1024,
      });
    });

    it('should handle null file', () => {
      const apiResponse = createMockApiResponse({ file: null });
      const result = VerificationResponseMapper.toDomain(apiResponse);

      expect(result.file).toBeNull();
    });

    it('should map invalid verdict', () => {
      const apiResponse = createMockApiResponse({
        verdict: 'invalid',
        failure_code: 'BAD_SIGNATURE',
        failure_reason: 'Signature invalide',
      });
      const result = VerificationResponseMapper.toDomain(apiResponse);

      expect(result.verdict).toBe('invalid');
      expect(result.failureCode).toBe('BAD_SIGNATURE');
      expect(result.failureReason).toBe('Signature invalide');
    });

    it('should map indeterminate verdict with online verification', () => {
      const apiResponse = createMockApiResponse({
        verdict: 'indeterminate',
        requires_online_verification: true,
        online_verification_url: 'https://verify.example.com',
        failure_code: 'ONLINE_VERIFICATION_REQUIRED',
      });
      const result = VerificationResponseMapper.toDomain(apiResponse);

      expect(result.verdict).toBe('indeterminate');
      expect(result.requiresOnlineVerification).toBe(true);
      expect(result.onlineVerificationUrl).toBe('https://verify.example.com');
      expect(result.failureCode).toBe('ONLINE_VERIFICATION_REQUIRED');
    });

    it('should map different detected types', () => {
      const kbisResponse = createMockApiResponse({ detected_type: 'kbis_infogreffe' });
      expect(VerificationResponseMapper.toDomain(kbisResponse).detectedType).toBe(
        'kbis_infogreffe'
      );

      const urssafResponse = createMockApiResponse({ detected_type: 'urssaf_code' });
      expect(VerificationResponseMapper.toDomain(urssafResponse).detectedType).toBe('urssaf_code');

      const unknownResponse = createMockApiResponse({ detected_type: 'unknown' });
      expect(VerificationResponseMapper.toDomain(unknownResponse).detectedType).toBe('unknown');
    });

    it('should map different trust levels', () => {
      const highResponse = createMockApiResponse({ trust_level: 'high' });
      expect(VerificationResponseMapper.toDomain(highResponse).trustLevel).toBe('high');

      const mediumResponse = createMockApiResponse({ trust_level: 'medium' });
      expect(VerificationResponseMapper.toDomain(mediumResponse).trustLevel).toBe('medium');

      const lowResponse = createMockApiResponse({ trust_level: 'low' });
      expect(VerificationResponseMapper.toDomain(lowResponse).trustLevel).toBe('low');
    });
  });
});
