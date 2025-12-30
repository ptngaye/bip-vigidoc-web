import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpDocumentVerifierGateway } from '../HttpDocumentVerifierGateway';
import { DocumentToVerify } from '@domain/entities';
import { NetworkError, RateLimitExceededError, VerificationFailedError } from '@application/errors';
import type { ApiVerificationResponse } from '../mappers/VerificationResponseMapper';
import { createMockFile } from '../../../test/createMockFile';

function createMockApiResponse(): ApiVerificationResponse {
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
    warnings: [],
    file: {
      filename: 'test.pdf',
      content_type: 'application/pdf',
      size_bytes: 1024,
    },
    verified_at: '2024-12-30T10:00:00Z',
  };
}

describe('HttpDocumentVerifierGateway', () => {
  const baseUrl = 'https://api.test.com';
  let gateway: HttpDocumentVerifierGateway;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    gateway = new HttpDocumentVerifierGateway(baseUrl);
    originalFetch = global.fetch;
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('verify', () => {
    it('should call the API with correct endpoint and method', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(createMockApiResponse()),
        headers: new Headers(),
      };
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      await gateway.verify(document);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/v1/verify`,
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should send X-Client-Id header with correct value', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(createMockApiResponse()),
        headers: new Headers(),
      };
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      await gateway.verify(document);

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      const requestOptions = fetchCall[1] as RequestInit;
      const headers = requestOptions.headers as Record<string, string>;

      expect(headers['X-Client-Id']).toBe('WEB-BIP-VIGIDOC');
    });

    it('should send X-Correlation-Id header with valid UUID', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(createMockApiResponse()),
        headers: new Headers(),
      };
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      await gateway.verify(document);

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      const requestOptions = fetchCall[1] as RequestInit;
      const headers = requestOptions.headers as Record<string, string>;

      expect(headers['X-Correlation-Id']).toBeDefined();
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      expect(headers['X-Correlation-Id']).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should return VerificationResult on success', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(createMockApiResponse()),
        headers: new Headers(),
      };
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      const result = await gateway.verify(document);

      expect(result.verificationId).toBe('test-uuid');
      expect(result.verdict).toBe('valid');
      expect(result.trustLevel).toBe('high');
    });

    it('should throw NetworkError on fetch failure', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      await expect(gateway.verify(document)).rejects.toThrow(NetworkError);
    });

    it('should throw RateLimitExceededError on 429 response', async () => {
      const mockResponse = {
        ok: false,
        status: 429,
        headers: new Headers({ 'X-RateLimit-Reset': '1703930400' }),
      };
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      await expect(gateway.verify(document)).rejects.toThrow(RateLimitExceededError);
    });

    it('should throw VerificationFailedError on 400 response', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        headers: new Headers(),
      };
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      await expect(gateway.verify(document)).rejects.toThrow(VerificationFailedError);
    });

    it('should throw VerificationFailedError on 413 response', async () => {
      const mockResponse = {
        ok: false,
        status: 413,
        headers: new Headers(),
      };
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      await expect(gateway.verify(document)).rejects.toThrow(VerificationFailedError);
    });

    it('should throw VerificationFailedError on 415 response', async () => {
      const mockResponse = {
        ok: false,
        status: 415,
        headers: new Headers(),
      };
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      await expect(gateway.verify(document)).rejects.toThrow(VerificationFailedError);
    });

    it('should throw NetworkError on 500 response', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        headers: new Headers(),
      };
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      await expect(gateway.verify(document)).rejects.toThrow(NetworkError);
    });

    it('should throw NetworkError on unexpected status code', async () => {
      const mockResponse = {
        ok: false,
        status: 418,
        headers: new Headers(),
      };
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

      const file = createMockFile();
      const document = DocumentToVerify.create(file);

      await expect(gateway.verify(document)).rejects.toThrow(NetworkError);
    });
  });
});
