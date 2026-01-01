import { describe, it, expect } from 'vitest';
import { FileSize } from '../FileSize';
import { FileTooLargeError } from '../../errors/DomainErrors';

describe('FileSize', () => {
  it('accepte une taille valide', () => {
    expect(() => FileSize.create(1024)).not.toThrow();
    expect(() => FileSize.create(FileSize.maxBytes)).not.toThrow();
  });

  it('rejette les fichiers trop gros ou invalides', () => {
    expect(() => FileSize.create(FileSize.maxBytes + 1)).toThrow(FileTooLargeError);
    expect(() => FileSize.create(0)).toThrow(FileTooLargeError);
    expect(() => FileSize.create(-1)).toThrow(FileTooLargeError);
  });
});
