import { describe, it, expect } from 'vitest';
import { DocumentToVerify } from '../DocumentToVerify';
import { FileTooLargeError, UnsupportedFileTypeError } from '../../errors/DomainErrors';
import { createMockFile } from '../../../test/createMockFile';

describe('DocumentToVerify', () => {
  describe('create', () => {
    it('should create a valid document for PDF', () => {
      const file = createMockFile({ type: 'application/pdf' });
      const document = DocumentToVerify.create(file);

      expect(document.file).toBe(file);
      expect(document.filename).toBe('test.pdf');
      expect(document.isPdf).toBe(true);
      expect(document.isImage).toBe(false);
    });

    it('should create a valid document for PNG image', () => {
      const file = createMockFile({ name: 'image.png', type: 'image/png' });
      const document = DocumentToVerify.create(file);

      expect(document.isPdf).toBe(false);
      expect(document.isImage).toBe(true);
    });

    it('should create a valid document for JPEG image', () => {
      const file = createMockFile({ name: 'image.jpg', type: 'image/jpeg' });
      const document = DocumentToVerify.create(file);

      expect(document.isPdf).toBe(false);
      expect(document.isImage).toBe(true);
    });

    it('should throw UnsupportedFileTypeError for unsupported type', () => {
      const file = createMockFile({ type: 'text/plain' });
      expect(() => DocumentToVerify.create(file)).toThrow(UnsupportedFileTypeError);
    });

    it('should throw FileTooLargeError for file exceeding max size', () => {
      const file = createMockFile({ size: 11 * 1024 * 1024 });
      expect(() => DocumentToVerify.create(file)).toThrow(FileTooLargeError);
    });
  });

  describe('getters', () => {
    it('should return correct filename', () => {
      const file = createMockFile({ name: 'my-document.pdf' });
      const document = DocumentToVerify.create(file);

      expect(document.filename).toBe('my-document.pdf');
    });

    it('should return correct contentType', () => {
      const file = createMockFile({ type: 'image/webp' });
      const document = DocumentToVerify.create(file);

      expect(document.contentType.value).toBe('image/webp');
    });

    it('should return correct fileSize', () => {
      const file = createMockFile({ size: 2048 });
      const document = DocumentToVerify.create(file);

      expect(document.fileSize.value).toBe(2048);
    });
  });
});
