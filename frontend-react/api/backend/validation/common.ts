import type { ValidationContext, ValidationError, ValidationResult, Validator } from './types';

function createError(code: string, message: string, path?: string, field?: string): ValidationError {
  return {
    code,
    message,
    severity: 'error',
    field,
    path,
  };
}

export class RequiredValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const isMissing = value === undefined || value === null || value === '';
    return {
      valid: !isMissing,
      errors: isMissing ? [createError('required', 'value is required', context?.path, context?.field)] : [],
    };
  }
}

export class StringValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'string';
    return {
      valid,
      errors: valid ? [] : [createError('string', 'value must be a string', context?.path, context?.field)],
    };
  }
}

export class NumberValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'number' && Number.isFinite(value);
    return {
      valid,
      errors: valid ? [] : [createError('number', 'value must be a number', context?.path, context?.field)],
    };
  }
}

export class BooleanValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'boolean';
    return {
      valid,
      errors: valid ? [] : [createError('boolean', 'value must be a boolean', context?.path, context?.field)],
    };
  }
}

export class ArrayValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = Array.isArray(value);
    return {
      valid,
      errors: valid ? [] : [createError('array', 'value must be an array', context?.path, context?.field)],
    };
  }
}

export class ObjectValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'object' && value !== null && !Array.isArray(value);
    return {
      valid,
      errors: valid ? [] : [createError('object', 'value must be an object', context?.path, context?.field)],
    };
  }
}

export class EnumValidator<T extends string> implements Validator<unknown> {
  constructor(private readonly allowedValues: readonly T[]) {}

  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'string' && this.allowedValues.includes(value as T);
    return {
      valid,
      errors: valid ? [] : [createError('enum', 'value is not allowed', context?.path, context?.field)],
    };
  }
}

export class UUIDValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    return {
      valid,
      errors: valid ? [] : [createError('uuid', 'value must be a valid UUID', context?.path, context?.field)],
    };
  }
}

export class EmailValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return {
      valid,
      errors: valid ? [] : [createError('email', 'value must be a valid email', context?.path, context?.field)],
    };
  }
}

export class PhoneValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'string' && /^\+?[0-9\s()-]{7,15}$/.test(value);
    return {
      valid,
      errors: valid ? [] : [createError('phone', 'value must be a valid phone number', context?.path, context?.field)],
    };
  }
}

export class UrlValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'string' && /^https?:\/\/.+/.test(value);
    return {
      valid,
      errors: valid ? [] : [createError('url', 'value must be a valid URL', context?.path, context?.field)],
    };
  }
}

export class DateValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = value instanceof Date && !Number.isNaN(value.getTime());
    return {
      valid,
      errors: valid ? [] : [createError('date', 'value must be a valid date', context?.path, context?.field)],
    };
  }
}

export class PaginationValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'object' && value !== null && 'page' in value && 'limit' in value;
    return {
      valid,
      errors: valid ? [] : [createError('pagination', 'value must include page and limit', context?.path, context?.field)],
    };
  }
}

export class SortingValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'object' && value !== null && 'sort' in value && 'order' in value;
    return {
      valid,
      errors: valid ? [] : [createError('sorting', 'value must include sort and order', context?.path, context?.field)],
    };
  }
}

export class FilteringValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'object' && value !== null;
    return {
      valid,
      errors: valid ? [] : [createError('filtering', 'value must be an object', context?.path, context?.field)],
    };
  }
}

export class SearchValidator implements Validator<unknown> {
  public validate(value: unknown, context?: Partial<ValidationContext>): ValidationResult {
    const valid = typeof value === 'string' || value === undefined || value === null;
    return {
      valid,
      errors: valid ? [] : [createError('search', 'value must be a string or empty', context?.path, context?.field)],
    };
  }
}
