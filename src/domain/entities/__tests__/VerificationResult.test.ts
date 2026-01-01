import { describe, it, expect } from 'vitest';
import { VerificationResult, type VerificationResultProps } from '../VerificationResult';

function createValidResultProps(
  overrides: Partial<VerificationResultProps> = {}
): VerificationResultProps {
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
  it('expose les propriétés du résultat de vérification', () => {
    const result = VerificationResult.create(createValidResultProps());

    expect(result.verificationId).toBe('test-uuid');
    expect(result.verdict).toBe('valid');
    expect(result.isValid).toBe(true);
  });

  it("protège l'immutabilité des champs extraits", () => {
    const result = VerificationResult.create(createValidResultProps());
    const fields = result.extractedFields;
    fields['hack'] = 'value';

    expect(result.extractedFields).not.toHaveProperty('hack');
  });
});
