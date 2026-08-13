<?php
namespace App\Core;

class Response
{
    private static function basePayload(bool $success, string $message, array $extra = []): array
    {
        $payload = [
            'success' => $success,
            'message' => $message,
        ];

        if (!empty($extra)) {
            $payload = array_merge($payload, $extra);
        }

        return $payload;
    }

    private static function emit(array $payload, int $httpStatus): void
    {
        if (!headers_sent()) {
            http_response_code($httpStatus);
        }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success(string $message = 'success', array $data = [], int $httpStatus = 200): void
    {
        self::emit(self::basePayload(true, $message, $data), $httpStatus);
    }

    public static function created(string $message = 'created', array $data = []): void
    {
        self::emit(self::basePayload(true, $message, $data), 201);
    }

    public static function updated(string $message = 'updated', array $data = []): void
    {
        self::emit(self::basePayload(true, $message, $data), 200);
    }

    public static function deleted(string $message = 'deleted', array $data = []): void
    {
        self::emit(self::basePayload(true, $message, $data), 200);
    }

    public static function error(string $message = 'error', array $data = [], int $httpStatus = 400): void
    {
        self::emit(self::basePayload(false, $message, $data), $httpStatus);
    }

    public static function validationError(string $message = 'validation error', array $errors = [], array $data = []): void
    {
        $extra = array_merge(['errors' => $errors], $data);
        self::emit(self::basePayload(false, $message, $extra), 422);
    }

    public static function unauthorized(string $message = 'unauthorized', array $data = []): void
    {
        self::emit(self::basePayload(false, $message, $data), 401);
    }

    public static function forbidden(string $message = 'forbidden', array $data = []): void
    {
        self::emit(self::basePayload(false, $message, $data), 403);
    }

    public static function notFound(string $message = 'not found', array $data = []): void
    {
        self::emit(self::basePayload(false, $message, $data), 404);
    }

    public static function conflict(string $message = 'conflict', array $data = []): void
    {
        self::emit(self::basePayload(false, $message, $data), 409);
    }

    public static function serverError(string $message = 'server error', array $data = []): void
    {
        self::emit(self::basePayload(false, $message, $data), 500);
    }
}

