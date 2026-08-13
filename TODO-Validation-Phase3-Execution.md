# Reference-only

This file is intentionally kept **non-tracking**.

Official execution status lives in: `TODO-steps.md`.

Legacy summary (Phase 3 Execution):
- Implement expandable Validation Rules engine in `app/Core/Validation.php`.
- Integrate into `save_order.php` first, then `api.php`.
- Acceptance: validation errors only via `Response::validationError()`; no duplicate endpoint validation.
- After success: ADR-003 + Phase3 report + update Foundation-Checklist/Architecture/Changelog.

