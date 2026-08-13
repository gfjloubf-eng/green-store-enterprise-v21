# Reference-only

This file is intentionally kept **non-tracking**.

Official execution status lives in: `TODO-steps.md`.

Legacy summary (Phase 3 — Validation Layer):
- Build reusable Validation Rules + Validation Result.
- Keep Validation Layer free from SQL/PDO/Database/Models.
- Return structured errors (no exceptions for validation failures).
- Integrate progressively: `save_order.php` then `api.php`.
- Ensure all validation errors go through `Response::validationError()`.


