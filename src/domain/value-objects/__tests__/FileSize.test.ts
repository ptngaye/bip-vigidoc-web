import { describe, it, expect } from 'vitest';
import { FileSize } from '../FileSize';
import { FileTooLargeError } from '../../errors/DomainErrors';

describe('FileSize', () => {
  describe('create', () => {
    it('should create a valid FileSize for size within limits', () => {
      const fileSize = FileSize.create(1024);
      expect(fileSize.value).toBe(1024);
    });

    it('should create a valid FileSize for exactly max size', () => {
      const maxSize = FileSize.maxBytes;
      const fileSize = FileSize.create(maxSize);
      expect(fileSize.value).toBe(maxSize);
    });

    it('should throw FileTooLargeError for size exceeding max', () => {
      const oversized = FileSize.maxBytes + 1;
      expect(() => FileSize.create(oversized)).toThrow(FileTooLargeError);
    });

    it('should throw FileTooLargeError for zero size', () => {
      expect(() => FileSize.create(0)).toThrow(FileTooLargeError);
    });

    it('should throw FileTooLargeError for negative size', () => {
      expect(() => FileSize.create(-1)).toThrow(FileTooLargeError);
    });
  });

  describe('maxBytes', () => {
    it('should return 10 MB in bytes', () => {
      expect(FileSize.maxBytes).toBe(10 * 1024 * 1024);
    });
  });
});
