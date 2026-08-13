export class DatabaseException extends Error {
  constructor(message?: string) {
    super(message ?? 'Database error');
    this.name = 'DatabaseException';
  }
}

export class RepositoryException extends Error {
  constructor(message?: string) {
    super(message ?? 'Repository error');
    this.name = 'RepositoryException';
  }
}

export class NotFoundException extends Error {
  constructor(message?: string) {
    super(message ?? 'Resource not found');
    this.name = 'NotFoundException';
  }
}

export class ConflictException extends Error {
  constructor(message?: string) {
    super(message ?? 'Conflict');
    this.name = 'ConflictException';
  }
}

export class ValidationException extends Error {
  constructor(message?: string) {
    super(message ?? 'Validation failed');
    this.name = 'ValidationException';
  }
}
