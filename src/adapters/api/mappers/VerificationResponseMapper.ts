import { VerificationResult } from '@domain/entities';
import type { VerificationResultProps, FileMetadata } from '@domain/entities';
import type { Verdict, DetectedDocumentType, TrustLevel, FailureCode } from '@domain/value-objects';

export interface ApiVerificationResponse {
  verification_id: string;
  verdict: string;
  detected_type: string;
  trust_level: string;
  requires_online_verification: boolean;
  online_verification_url: string | null;
  document_type: string | null;
  document_type_label: string | null;
  document_family: string;
  emission_date: string | null;
  issuer: string | null;
  extracted_fields: Record<string, string>;
  failure_code: string | null;
  failure_reason: string | null;
  warnings: string[];
  file: {
    filename: string;
    content_type: string;
    size_bytes: number;
  } | null;
  verified_at: string;
}

export class VerificationResponseMapper {
  static toDomain(response: ApiVerificationResponse): VerificationResult {
    const fileMetadata: FileMetadata | null = response.file
      ? {
          filename: response.file.filename,
          contentType: response.file.content_type,
          sizeBytes: response.file.size_bytes,
        }
      : null;

    const props: VerificationResultProps = {
      verificationId: response.verification_id,
      verdict: response.verdict as Verdict,
      detectedType: response.detected_type as DetectedDocumentType,
      trustLevel: response.trust_level as TrustLevel,
      requiresOnlineVerification: response.requires_online_verification,
      onlineVerificationUrl: response.online_verification_url,
      documentType: response.document_type,
      documentTypeLabel: response.document_type_label,
      documentFamily: response.document_family,
      emissionDate: response.emission_date,
      issuer: response.issuer,
      extractedFields: response.extracted_fields,
      failureCode: response.failure_code as FailureCode | null,
      failureReason: response.failure_reason,
      warnings: response.warnings,
      file: fileMetadata,
      verifiedAt: response.verified_at,
    };

    return VerificationResult.create(props);
  }
}
