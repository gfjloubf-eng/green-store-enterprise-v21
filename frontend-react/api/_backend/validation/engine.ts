import type { ValidationContext, ValidationResult, ValidationRule, Validator } from './types';
import { ConstraintViolationError, InvalidRequestError } from './errors';

export class ValidationEngine {
  public validate<T>(value: T, validator: Validator<T>, context?: Partial<ValidationContext>): ValidationResult {
    return validator.validate(value, context);
  }

  public async validateAsync<T>(value: T, validator: Validator<T>, context?: Partial<ValidationContext>): Promise<ValidationResult> {
    if (validator.validateAsync) {
      return validator.validateAsync(value, context);
    }
    return this.validate(value, validator, context);
  }

  public validateOrThrow<T>(value: T, validator: Validator<T>, context?: Partial<ValidationContext>): T {
    const result = this.validate(value, validator, context);
    if (!result.valid) {
      throw new InvalidRequestError(result.errors.map((error) => error.message).join(', '));
    }
    return value;
  }

  public composeValidators<T>(...validators: Array<Validator<T> | ValidationRule<T>>): Validator<T> {
    return {
      validate: (value, context) => {
        const errors: ValidationResult['errors'] = [];
        for (const validator of validators) {
          const result = this.evaluateCompositeValidator(validator, value, context);
          if (!result.valid) {
            errors.push(...result.errors);
          }
        }
        return { valid: errors.length === 0, errors };
      },
    };
  }

  public composeRules<T>(...rules: ValidationRule<T>[]): ValidationRule<T> {
    return {
      name: 'composed',
      validate: (context) => {
        const errors: ValidationResult['errors'] = [];
        for (const rule of rules) {
          const result = rule.validate(context);
          if (!result.valid) {
            errors.push(...result.errors);
          }
        }
        return { valid: errors.length === 0, errors };
      },
    };
  }

  private evaluateCompositeValidator<T>(validator: Validator<T> | ValidationRule<T>, value: T, context?: Partial<ValidationContext>): ValidationResult {
    const isValidator = 'validate' in validator && typeof validator.validate === 'function' && validator.validate.length > 1;
    if (isValidator) {
      return (validator as Validator<T>).validate(value, context);
    }

    return (validator as ValidationRule<T>).validate({ value, ...context });
  }
}

export default new ValidationEngine();
