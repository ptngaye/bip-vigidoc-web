import { FileTooLargeError } from '../errors/DomainErrors';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export class FileSize {
  private constructor(private readonly bytes: number) {}

  static create(bytes: number): FileSize {
    if (bytes <= 0) {
      throw new FileTooLargeError('File size must be positive');
    }
    if (bytes > MAX_FILE_SIZE_BYTES) {
      throw new FileTooLargeError(`File size exceeds maximum allowed (${MAX_FILE_SIZE_BYTES} bytes)`);
    }
    return new FileSize(bytes);
  }

  get value(): number {
    return this.bytes;
  }

  static get maxBytes(): number {
    return MAX_FILE_SIZE_BYTES;
  }
}
