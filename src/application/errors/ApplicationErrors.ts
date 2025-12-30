export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class VerificationFailedError extends ApplicationError {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
  }
}

export class NetworkError extends ApplicationError {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
  }
}

export class RateLimitExceededError extends ApplicationError {
  constructor(public readonly retryAfterSeconds?: number) {
    super('Rate limit exceeded. Please try again later.');
  }
}
