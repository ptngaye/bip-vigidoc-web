import { describe, it, expect } from 'vitest';
import { ContentType } from '../ContentType';
import { UnsupportedFileTypeError } from '../../errors/DomainErrors';

describe('ContentType', () => {
  it('accepte les types supportés (pdf, png, jpeg, webp)', () => {
    expect(() => ContentType.create('application/pdf')).not.toThrow();
    expect(() => ContentType.create('image/png')).not.toThrow();
    expect(() => ContentType.create('image/jpeg')).not.toThrow();
    expect(() => ContentType.create('image/webp')).not.toThrow();
  });

  it('rejette les types non supportés', () => {
    expect(() => ContentType.create('text/plain')).toThrow(UnsupportedFileTypeError);
    expect(() => ContentType.create('')).toThrow(UnsupportedFileTypeError);
  });
});
