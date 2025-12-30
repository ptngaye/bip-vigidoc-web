export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class FileTooLargeError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class UnsupportedFileTypeError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidDocumentError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
