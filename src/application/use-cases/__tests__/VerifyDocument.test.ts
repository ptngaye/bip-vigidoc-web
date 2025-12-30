import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VerifyDocument } from '../VerifyDocument';
import type { DocumentVerifierGateway } from '../../ports';
import { VerificationResult } from '@domain/entities';
import { FileTooLargeError, UnsupportedFileTypeError } from '@domain/errors';
import { VerificationFailedError } from '../../errors';
import { createMockFile } from '../../../test/createMockFile';

function createMockVerificationResult(): VerificationResult {
  return VerificationResult.create({
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
    extractedFields: {},
    failureCode: null,
    failureReason: null,
    warnings: [],
    file: null,
    verifiedAt: '2024-12-30T10:00:00Z',
  });
}

describe('VerifyDocument', () => {
  let mockGateway: DocumentVerifierGateway;
  let useCase: VerifyDocument;

  beforeEach(() => {
    mockGateway = {
      verify: vi.fn(),
    };
    useCase = new VerifyDocument(mockGateway);
  });

  describe('execute', () => {
    it('should return success with verification result when verification succeeds', async () => {
      const file = createMockFile();
      const expectedResult = createMockVerificationResult();
      vi.mocked(mockGateway.verify).mockResolvedValue(expectedResult);

      const result = await useCase.execute({ file });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verificationId).toBe('test-uuid');
        expect(result.data.verdict).toBe('valid');
      }
    });

    it('should call gateway with document', async () => {
      const file = createMockFile();
      vi.mocked(mockGateway.verify).mockResolvedValue(createMockVerificationResult());

      await useCase.execute({ file });

      expect(mockGateway.verify).toHaveBeenCalledTimes(1);
      const calledDocument = vi.mocked(mockGateway.verify).mock.calls[0][0];
      expect(calledDocument.filename).toBe('test.pdf');
    });

    it('should return error when file type is unsupported', async () => {
      const file = createMockFile({ type: 'text/plain' });

      const result = await useCase.execute({ file });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(UnsupportedFileTypeError);
      }
    });

    it('should return error when file is too large', async () => {
      const file = createMockFile({ size: 11 * 1024 * 1024 });

      const result = await useCase.execute({ file });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(FileTooLargeError);
      }
    });

    it('should return error when gateway throws VerificationFailedError', async () => {
      const file = createMockFile();
      const error = new VerificationFailedError('Gateway error');
      vi.mocked(mockGateway.verify).mockRejectedValue(error);

      const result = await useCase.execute({ file });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(VerificationFailedError);
        expect(result.error.message).toBe('Gateway error');
      }
    });

    it('should wrap unexpected errors in VerificationFailedError', async () => {
      const file = createMockFile();
      vi.mocked(mockGateway.verify).mockRejectedValue(new Error('Unexpected error'));

      const result = await useCase.execute({ file });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(VerificationFailedError);
        expect(result.error.message).toBe('An unexpected error occurred during verification');
      }
    });

    it('should handle non-Error throws', async () => {
      const file = createMockFile();
      vi.mocked(mockGateway.verify).mockRejectedValue('string error');

      const result = await useCase.execute({ file });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(VerificationFailedError);
      }
    });
  });
});
