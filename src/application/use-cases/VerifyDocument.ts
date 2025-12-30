import type { DocumentVerifierGateway } from '../ports';
import { DocumentToVerify, VerificationResult } from '@domain/entities';
import { DomainError } from '@domain/errors';
import { VerificationFailedError } from '../errors';

export interface VerifyDocumentRequest {
  file: File;
}

export type VerifyDocumentResult =
  | { success: true; data: VerificationResult }
  | { success: false; error: VerificationFailedError | DomainError };

export class VerifyDocument {
  constructor(private readonly documentVerifierGateway: DocumentVerifierGateway) {}

  async execute(request: VerifyDocumentRequest): Promise<VerifyDocumentResult> {
    try {
      const document = DocumentToVerify.create(request.file);
      const result = await this.documentVerifierGateway.verify(document);

      return { success: true, data: result };
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error };
      }

      if (error instanceof VerificationFailedError) {
        return { success: false, error };
      }

      return {
        success: false,
        error: new VerificationFailedError(
          'An unexpected error occurred during verification',
          error instanceof Error ? error : undefined
        ),
      };
    }
  }
}
