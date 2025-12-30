import type { Verdict, DetectedDocumentType, TrustLevel, FailureCode } from '../value-objects';
import type { FileMetadata } from './FileMetadata';

export interface VerificationResultProps {
  readonly verificationId: string;
  readonly verdict: Verdict;
  readonly detectedType: DetectedDocumentType;
  readonly trustLevel: TrustLevel;
  readonly requiresOnlineVerification: boolean;
  readonly onlineVerificationUrl: string | null;
  readonly documentType: string | null;
  readonly documentTypeLabel: string | null;
  readonly documentFamily: string;
  readonly emissionDate: string | null;
  readonly issuer: string | null;
  readonly extractedFields: Record<string, string>;
  readonly failureCode: FailureCode | null;
  readonly failureReason: string | null;
  readonly warnings: string[];
  readonly file: FileMetadata | null;
  readonly verifiedAt: string;
}

export class VerificationResult {
  private constructor(private readonly props: VerificationResultProps) {}

  static create(props: VerificationResultProps): VerificationResult {
    return new VerificationResult(props);
  }

  get verificationId(): string {
    return this.props.verificationId;
  }

  get verdict(): Verdict {
    return this.props.verdict;
  }

  get detectedType(): DetectedDocumentType {
    return this.props.detectedType;
  }

  get trustLevel(): TrustLevel {
    return this.props.trustLevel;
  }

  get requiresOnlineVerification(): boolean {
    return this.props.requiresOnlineVerification;
  }

  get onlineVerificationUrl(): string | null {
    return this.props.onlineVerificationUrl;
  }

  get documentType(): string | null {
    return this.props.documentType;
  }

  get documentTypeLabel(): string | null {
    return this.props.documentTypeLabel;
  }

  get documentFamily(): string {
    return this.props.documentFamily;
  }

  get emissionDate(): string | null {
    return this.props.emissionDate;
  }

  get issuer(): string | null {
    return this.props.issuer;
  }

  get extractedFields(): Record<string, string> {
    return { ...this.props.extractedFields };
  }

  get failureCode(): FailureCode | null {
    return this.props.failureCode;
  }

  get failureReason(): string | null {
    return this.props.failureReason;
  }

  get warnings(): string[] {
    return [...this.props.warnings];
  }

  get file(): FileMetadata | null {
    return this.props.file;
  }

  get verifiedAt(): string {
    return this.props.verifiedAt;
  }

  get isValid(): boolean {
    return this.verdict === 'valid';
  }

  get isInvalid(): boolean {
    return this.verdict === 'invalid';
  }

  get isIndeterminate(): boolean {
    return this.verdict === 'indeterminate';
  }

  get hasHighTrust(): boolean {
    return this.trustLevel === 'high';
  }

  get hasMediumTrust(): boolean {
    return this.trustLevel === 'medium';
  }

  get hasLowTrust(): boolean {
    return this.trustLevel === 'low';
  }
}
