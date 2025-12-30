import { UnsupportedFileTypeError } from '../errors/DomainErrors';

const SUPPORTED_CONTENT_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export type SupportedContentType = (typeof SUPPORTED_CONTENT_TYPES)[number];

export class ContentType {
  private constructor(private readonly type: SupportedContentType) {}

  static create(type: string): ContentType {
    if (!ContentType.isSupported(type)) {
      throw new UnsupportedFileTypeError(
        `Unsupported file type: ${type}. Supported types: ${SUPPORTED_CONTENT_TYPES.join(', ')}`
      );
    }
    return new ContentType(type as SupportedContentType);
  }

  static isSupported(type: string): type is SupportedContentType {
    return SUPPORTED_CONTENT_TYPES.includes(type as SupportedContentType);
  }

  get value(): SupportedContentType {
    return this.type;
  }

  get isPdf(): boolean {
    return this.type === 'application/pdf';
  }

  get isImage(): boolean {
    return this.type.startsWith('image/');
  }

  static get supportedTypes(): readonly string[] {
    return SUPPORTED_CONTENT_TYPES;
  }
}
