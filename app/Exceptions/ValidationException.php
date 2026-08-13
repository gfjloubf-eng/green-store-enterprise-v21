<?php
namespace App\Exceptions;

use Exception;

class ValidationException extends Exception
{
    protected $errors;

    public function __construct($message = "Validation Error", $errors = [], $code = 422)
    {
        parent::__construct($message, $code);
        $this->errors = $errors;
    }

    public function getErrors()
    {
        return $this->errors;
    }
}
