import type { DocumentToVerify, VerificationResult } from '@domain/entities';

export interface DocumentVerifierGateway {
  verify(document: DocumentToVerify): Promise<VerificationResult>;
}
