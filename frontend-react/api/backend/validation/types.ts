export type ValidationSeverity = 'error' | 'warning';

export interface ValidationMetadata {
  readonly field?: string;
  readonly path?: string;
  readonly code: string;
  readonly message: string;
  readonly severity: ValidationSeverity;
  readonly constraint?: string;
}

export interface ValidationError extends ValidationMetadata {}

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: ValidationError[];
}

export interface ValidationContext {
  readonly value: unknown;
  readonly path?: string;
  readonly field?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface ValidationRule<T = unknown> {
  readonly name: string;
  readonly validate: (context: ValidationContext) => ValidationResult;
  readonly validateAsync?: (context: ValidationContext) => Promise<ValidationResult>;
}

export interface Validator<T = unknown> {
  readonly validate: (value: T, context?: Partial<ValidationContext>) => ValidationResult;
  readonly validateAsync?: (value: T, context?: Partial<ValidationContext>) => Promise<ValidationResult>;
}
