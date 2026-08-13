<?php
namespace App\Core;

/**
 * Validation Layer
 * - Validation-only: no sanitization, no storage, no SQL/PDO/Database/Models
 * - Returns structured Validation Result; does NOT throw on validation failure
 */
class Validation
{
    public static function validate(array $data, array $schema, ?array $context = null): ValidationResult
    {
        $context = $context ?? [];
        $result = new ValidationResult();

        foreach ($schema as $field => $rules) {
            $valueExists = array_key_exists($field, $data);
            $value = $valueExists ? $data[$field] : null;

            foreach ($rules as $ruleSpec) {
                if (is_string($ruleSpec)) {
                    $rule = ValidationRuleFactory::fromString($ruleSpec);
                    $rule->validate($field, $value, $valueExists, $result, $context);
                    continue;
                }

                if (is_array($ruleSpec) && isset($ruleSpec['rule'])) {
                    $rule = ValidationRuleFactory::fromArray($ruleSpec);
                    $rule->validate($field, $value, $valueExists, $result, $context);
                    continue;
                }
            }
        }

        return $result;
    }

    public static function isEmpty($value): bool
    {
        return $value === null || $value === '';
    }
}

class ValidationResult
{
    private bool $passed;

    /**
     * @var array<int, array{field:string,message:string,code?:string}>
     */
    private array $errors = [];

    public function __construct(bool $passed = true)
    {
        $this->passed = $passed;
    }

    public function addError(string $field, string $message, ?string $code = null): void
    {
        $this->passed = false;
        $err = ['field' => $field, 'message' => $message];
        if ($code !== null) {
            $err['code'] = $code;
        }
        $this->errors[] = $err;
    }

    public function passed(): bool
    {
        return $this->passed;
    }

    /**
     * @return array<int, array{field:string,message:string,code?:string}>
     */
    public function errors(): array
    {
        return $this->errors;
    }
}

interface ValidationRule
{
    public function validate(
        string $field,
        $value,
        bool $valueExists,
        ValidationResult $result,
        array $context
    ): void;
}

class ValidationRuleFactory
{
    public static function fromString(string $spec): ValidationRule
    {
        $spec = trim($spec);
        if ($spec === '') {
            return new PassThroughRule();
        }

        $parts = explode(':', $spec, 2);
        $name = strtolower(trim($parts[0]));
        $param = $parts[1] ?? null;

        return self::make($name, $param);
    }

    public static function fromArray(array $spec): ValidationRule
    {
        $name = strtolower((string)($spec['rule'] ?? ''));
        $param = $spec['params'] ?? ($spec['param'] ?? null);
        return self::make($name, $param);
    }

    private static function make(string $name, $param): ValidationRule
    {
        return match ($name) {
            'required' => new RequiredRule(),
            'nullable' => new NullableRule(),

            'string' => new TypeRule('string'),
            'integer' => new TypeRule('integer'),
            'numeric' => new TypeRule('numeric'),
            'boolean' => new TypeRule('boolean'),
            'array' => new TypeRule('array'),

            'email' => new FormatRule('email'),
            'url' => new FormatRule('url'),

            'min' => new LengthRule('min', (int)$param),
            'max' => new LengthRule('max', (int)$param),
            'between' => (is_string($param) && str_contains($param, ','))
                ? new LengthBetweenRule(explode(',', $param)[0], explode(',', $param)[1])
                : new LengthBetweenRule(null, null),

            'regex' => new PatternRule('regex', (string)$param),
            'in' => new PatternRule('in', $param),
            'not_in' => new PatternRule('not_in', $param),

            // Structure-only for injection later.
            'unique' => new PlaceholderExistsUniqueRule('unique'),
            'exists' => new PlaceholderExistsUniqueRule('exists'),

            default => new UnknownRule($name),
        };
    }
}

class PassThroughRule implements ValidationRule
{
    public function validate(string $field, $value, bool $valueExists, ValidationResult $result, array $context): void
    {
        // no-op
    }
}

class UnknownRule implements ValidationRule
{
    public function __construct(private string $name)
    {
    }

    public function validate(string $field, $value, bool $valueExists, ValidationResult $result, array $context): void
    {
        // Unknown rule: do nothing (keeps Validation non-blocking for future rules).
    }
}

class RequiredRule implements ValidationRule
{
    public function validate(string $field, $value, bool $valueExists, ValidationResult $result, array $context): void
    {
        if (!$valueExists) {
            $result->addError($field, 'The field is required.', 'required');
            return;
        }

        if (Validation::isEmpty($value)) {
            $result->addError($field, 'The field is required.', 'required');
        }
    }
}

class NullableRule implements ValidationRule
{
    public function validate(string $field, $value, bool $valueExists, ValidationResult $result, array $context): void
    {
        // If value is null/empty, other rules should decide whether to run.
        // We implement this by doing nothing here.
    }
}

class TypeRule implements ValidationRule
{
    public function __construct(private string $type)
    {
    }

    public function validate(string $field, $value, bool $valueExists, ValidationResult $result, array $context): void
    {
        if (Validation::isEmpty($value)) {
            return;
        }

        $ok = match ($this->type) {
            'string' => is_string($value),
            'integer' => is_int($value) || (is_string($value) && filter_var($value, FILTER_VALIDATE_INT) !== false),
            'numeric' => is_numeric($value),
            'boolean' => is_bool($value) || in_array($value, [0, 1, '0', '1', 'true', 'false'], true),
            'array' => is_array($value),
            default => true,
        };

        if (!$ok) {
            $result->addError($field, 'Invalid type.', $this->type);
        }
    }
}

class FormatRule implements ValidationRule
{
    public function __construct(private string $format)
    {
    }

    public function validate(string $field, $value, bool $valueExists, ValidationResult $result, array $context): void
    {
        if (Validation::isEmpty($value)) {
            return;
        }

        $ok = match ($this->format) {
            'email' => is_string($value) && filter_var($value, FILTER_VALIDATE_EMAIL) !== false,
            'url' => is_string($value) && filter_var($value, FILTER_VALIDATE_URL) !== false,
            default => true,
        };

        if (!$ok) {
            $result->addError($field, 'Invalid format.', $this->format);
        }
    }
}

class LengthRule implements ValidationRule
{
    public function __construct(private string $kind, private int $n)
    {
    }

    public function validate(string $field, $value, bool $valueExists, ValidationResult $result, array $context): void
    {
        if (Validation::isEmpty($value)) {
            return;
        }

        $len = is_array($value)
            ? count($value)
            : (is_string($value) ? mb_strlen($value) : null);

        if ($len === null) {
            $result->addError($field, 'Invalid length input.', $this->kind);
            return;
        }

        $ok = match ($this->kind) {
            'min' => $len >= $this->n,
            'max' => $len <= $this->n,
            default => true,
        };

        if (!$ok) {
            $result->addError($field, 'Invalid length.', $this->kind);
        }
    }
}

class LengthBetweenRule implements ValidationRule
{
    public function __construct(private $min, private $max)
    {
    }

    public function validate(string $field, $value, bool $valueExists, ValidationResult $result, array $context): void
    {
        if (Validation::isEmpty($value)) {
            return;
        }

        $len = is_array($value)
            ? count($value)
            : (is_string($value) ? mb_strlen($value) : null);

        if ($len === null) {
            $result->addError($field, 'Invalid length input.', 'between');
            return;
        }

        if ($this->min === null || $this->max === null) {
            return;
        }

        if (!($len >= (int)$this->min && $len <= (int)$this->max)) {
            $result->addError($field, 'Invalid length.', 'between');
        }
    }
}

class PatternRule implements ValidationRule
{
    public function __construct(private string $kind, private $param)
    {
    }

    public function validate(string $field, $value, bool $valueExists, ValidationResult $result, array $context): void
    {
        if (Validation::isEmpty($value)) {
            return;
        }

        $ok = match ($this->kind) {
            'regex' => is_string($value) && is_string($this->param) && @preg_match($this->param, $value) === 1,
            'in' => self::inList($value, $this->param),
            'not_in' => !self::inList($value, $this->param),
            default => true,
        };

        if (!$ok) {
            $result->addError($field, 'Invalid value.', $this->kind);
        }
    }

    private static function inList($value, $param): bool
    {
        if ($param === null) {
            return false;
        }

        if (is_string($param)) {
            $list = array_map('trim', explode(',', $param));
        } elseif (is_array($param)) {
            $list = $param;
        } else {
            $list = [$param];
        }

        return in_array($value, $list, true);
    }
}

class PlaceholderExistsUniqueRule implements ValidationRule
{
    public function __construct(private string $kind)
    {
    }

    public function validate(string $field, $value, bool $valueExists, ValidationResult $result, array $context): void
    {
        // Structure-only.
        // Later, $context['checks'] can inject callbacks for exists/unique.
        // For now, keep runtime stable and skip actual existence verification.
    }
}

