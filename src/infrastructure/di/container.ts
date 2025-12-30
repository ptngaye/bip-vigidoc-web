import { HttpDocumentVerifierGateway } from '@adapters/api';
import { VerifyDocument } from '@application/use-cases';
import { apiConfig } from '../config';

function createDocumentVerifierGateway() {
  return new HttpDocumentVerifierGateway(apiConfig.baseUrl);
}

function createVerifyDocumentUseCase() {
  const gateway = createDocumentVerifierGateway();
  return new VerifyDocument(gateway);
}

export const container = {
  verifyDocument: createVerifyDocumentUseCase,
} as const;
