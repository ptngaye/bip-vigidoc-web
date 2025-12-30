import { describe, it, expect } from 'vitest';
import { ContentType } from '../ContentType';
import { UnsupportedFileTypeError } from '../../errors/DomainErrors';

describe('ContentType', () => {
  describe('create', () => {
    it('should create ContentType for application/pdf', () => {
      const contentType = ContentType.create('application/pdf');
      expect(contentType.value).toBe('application/pdf');
    });

    it('should create ContentType for image/png', () => {
      const contentType = ContentType.create('image/png');
      expect(contentType.value).toBe('image/png');
    });

    it('should create ContentType for image/jpeg', () => {
      const contentType = ContentType.create('image/jpeg');
      expect(contentType.value).toBe('image/jpeg');
    });

    it('should create ContentType for image/webp', () => {
      const contentType = ContentType.create('image/webp');
      expect(contentType.value).toBe('image/webp');
    });

    it('should throw UnsupportedFileTypeError for unsupported type', () => {
      expect(() => ContentType.create('text/plain')).toThrow(UnsupportedFileTypeError);
    });

    it('should throw UnsupportedFileTypeError for empty string', () => {
      expect(() => ContentType.create('')).toThrow(UnsupportedFileTypeError);
    });
  });

  describe('isSupported', () => {
    it('should return true for supported types', () => {
      expect(ContentType.isSupported('application/pdf')).toBe(true);
      expect(ContentType.isSupported('image/png')).toBe(true);
      expect(ContentType.isSupported('image/jpeg')).toBe(true);
      expect(ContentType.isSupported('image/webp')).toBe(true);
    });

    it('should return false for unsupported types', () => {
      expect(ContentType.isSupported('text/plain')).toBe(false);
      expect(ContentType.isSupported('application/json')).toBe(false);
    });
  });

  describe('isPdf', () => {
    it('should return true for PDF', () => {
      const contentType = ContentType.create('application/pdf');
      expect(contentType.isPdf).toBe(true);
    });

    it('should return false for images', () => {
      const contentType = ContentType.create('image/png');
      expect(contentType.isPdf).toBe(false);
    });
  });

  describe('isImage', () => {
    it('should return true for images', () => {
      expect(ContentType.create('image/png').isImage).toBe(true);
      expect(ContentType.create('image/jpeg').isImage).toBe(true);
      expect(ContentType.create('image/webp').isImage).toBe(true);
    });

    it('should return false for PDF', () => {
      const contentType = ContentType.create('application/pdf');
      expect(contentType.isImage).toBe(false);
    });
  });

  describe('supportedTypes', () => {
    it('should return all supported types', () => {
      const types = ContentType.supportedTypes;
      expect(types).toContain('application/pdf');
      expect(types).toContain('image/png');
      expect(types).toContain('image/jpeg');
      expect(types).toContain('image/webp');
      expect(types.length).toBe(4);
    });
  });
});
