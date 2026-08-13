# Reference-only

This file is intentionally kept **non-tracking**.

Official execution status lives in: `TODO-steps.md`.

Legacy summary (Validation Layer):
- Upgrade `app/Core/Validation.php` into reusable validator (Rules + Schemas).
- Support basic rules, length rules, pattern rules.
- Prepare injection-ready `unique` / `exists` extensibility (structure only).
- Validation-only behavior; structured Validation Result; no exceptions on validation failure.
- Integrate with Response Layer: `Response::validationError()`.
- Migrate endpoint validation: `api.php` and `save_order.php`.
- Manual/behavioral tests + final acceptance audit.


