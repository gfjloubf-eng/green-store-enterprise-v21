import type { ValidationContext, ValidationResult, ValidationRule, Validator } from './types';

export class AndValidator<T> implements Validator<T> {
  constructor(private readonly validators: readonly Validator<T>[]) {}

  public validate(value: T, context?: Partial<ValidationContext>): ValidationResult {
    const errors: ValidationResult['errors'] = [];
    for (const validator of this.validators) {
      const result = validator.validate(value, context);
      if (!result.valid) {
        errors.push(...result.errors);
      }
    }
    return { valid: errors.length === 0, errors };
  }
}

export class OrValidator<T> implements Validator<T> {
  constructor(private readonly validators: readonly Validator<T>[]) {}

  public validate(value: T, context?: Partial<ValidationContext>): ValidationResult {
    const results = this.validators.map((validator) => validator.validate(value, context));
    const valid = results.some((result) => result.valid);
    return {
      valid,
      errors: valid ? [] : results.flatMap((result) => result.errors),
    };
  }
}

export class ConditionalValidator<T> implements Validator<T> {
  constructor(
    private readonly predicate: (value: T) => boolean,
    private readonly validator: Validator<T>,
  ) {}

  public validate(value: T, context?: Partial<ValidationContext>): ValidationResult {
    if (!this.predicate(value)) {
      return { valid: true, errors: [] };
    }
    return this.validator.validate(value, context);
  }
}

export class NestedValidator<T> implements Validator<T> {
  constructor(private readonly validator: Validator<T>) {}

  public validate(value: T, context?: Partial<ValidationContext>): ValidationResult {
    return this.validator.validate(value, context);
  }
}

export class RuleValidator<T> implements Validator<T> {
  constructor(private readonly rule: ValidationRule<T>) {}

  public validate(value: T, context?: Partial<ValidationContext>): ValidationResult {
    return this.rule.validate({ value, ...context });
  }
}
