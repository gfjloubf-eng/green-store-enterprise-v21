# ADR-002-Response-Layer

## Status
Accepted

## Context
Green Store uses multiple PHP endpoints (e.g., `api.php`, `save_order.php`) that previously responded by writing JSON manually via:
- `header('Content-Type: application/json')`
- `http_response_code(...)`
- `echo json_encode(...)`

This pattern led to:
- code duplication across endpoints
- non-unified error/success/validation formats
- harder future evolution of response fields
- risk of breaking frontend expectations during incremental changes

## Decision
Create a centralized Response Layer at `App\Core\Response`.

All endpoints must return JSON only through this layer.

Supported functions:
- `success()`
- `created()`
- `updated()`
- `deleted()`
- `error()`
- `validationError()`
- `unauthorized()`
- `forbidden()`
- `notFound()`
- `conflict()`
- `serverError()`

`App\Core\Response` owns:
- `Content-Type: application/json; charset=utf-8`
- HTTP status code
- JSON payload structure

## How it prevents duplication
Endpoints should not contain:
- `echo json_encode(...)`
- `header(...)`
- `http_response_code(...)`

Instead, they should call `Response::*`.

## How it serves REST APIs later
- Standard payload envelope across REST APIs
- Easier mapping from Validation/Security/Exceptions to HTTP responses
- Easy extension for pagination, correlation ids, error codes, etc.

## Backward Compatibility
- The payload envelope keeps `success` and `message` fields.
- Only response writing mechanics were centralized to minimize behavior changes.

