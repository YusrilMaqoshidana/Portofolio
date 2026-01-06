// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, code: string = 'AUTH_ERROR') {
    super(message, code, 401);
    this.name = 'AuthError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code: string = 'VALIDATION_ERROR') {
    super(message, code, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, code: string = 'NOT_FOUND') {
    super(message, code, 404);
    this.name = 'NotFoundError';
  }
}

export class PermissionError extends AppError {
  constructor(message: string, code: string = 'PERMISSION_DENIED') {
    super(message, code, 403);
    this.name = 'PermissionError';
  }
}
