import type { DocumentVerifierGateway } from '@application/ports';
import type { DocumentToVerify, VerificationResult } from '@domain/entities';
import { NetworkError, RateLimitExceededError, VerificationFailedError } from '@application/errors';
import {
  VerificationResponseMapper,
  type ApiVerificationResponse,
} from './mappers/VerificationResponseMapper';
import { getSessionId, setSessionId } from '../session';

const CLIENT_ID = 'WEB-BIP-VIGIDOC';
const SESSION_ID_HEADER = 'X-Session-Id';

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

export class HttpDocumentVerifierGateway implements DocumentVerifierGateway {
  constructor(private readonly baseUrl: string) {}

  async verify(document: DocumentToVerify): Promise<VerificationResult> {
    const formData = new FormData();
    formData.append('file', document.file);

    let response: Response;

    try {
      const sessionId = getSessionId();
      response = await fetch(`${this.baseUrl}/v1/verify`, {
        method: 'POST',
        headers: {
          'X-Correlation-Id': crypto.randomUUID(),
          'X-Client-Id': CLIENT_ID,
          ...(sessionId && { [SESSION_ID_HEADER]: sessionId }),
        },
        body: formData,
      });
    } catch (error) {
      throw new NetworkError(
        'Failed to connect to verification service. Please check your internet connection.'
      );
    }

    if (response.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
      const retryAfter = response.headers.get('X-RateLimit-Reset');
      throw new RateLimitExceededError(retryAfter ? parseInt(retryAfter, 10) : undefined);
    }

    if (response.status === HTTP_STATUS.BAD_REQUEST) {
      throw new VerificationFailedError('Invalid request: file may be missing or malformed');
    }

    if (response.status === HTTP_STATUS.PAYLOAD_TOO_LARGE) {
      throw new VerificationFailedError('File is too large. Maximum size is 10 MB.');
    }

    if (response.status === HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE) {
      throw new VerificationFailedError('Unsupported file type. Please upload a PDF or image.');
    }

    if (response.status >= HTTP_STATUS.SERVER_ERROR) {
      throw new NetworkError('Server error. Please try again later.', response.status);
    }

    if (response.status !== HTTP_STATUS.OK) {
      throw new NetworkError(`Unexpected response status: ${response.status}`, response.status);
    }

    // Store session ID from response if backend provided one
    const responseSessionId = response.headers.get(SESSION_ID_HEADER);
    if (responseSessionId) {
      setSessionId(responseSessionId);
    }

    const data: ApiVerificationResponse = await response.json();
    return VerificationResponseMapper.toDomain(data);
  }
}
