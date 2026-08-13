# TODO-Phase3-Validation-Layer (Integration)

## Step 1 — save_order.php integration (validation-only)
- [ ] Replace manual checks for request structure + types with Validation::validate()
- [ ] Ensure all validation failures go through Response::validationError()
- [ ] Preserve Business Logic: transactions, price calculation, DB inserts, existing DB product existence check
- [ ] Preserve field names and frontend-visible messages as much as possible
- [ ] Ensure no manual JSON/echo/http_response_code in endpoint for validation

## Step 2 — api.php integration
- [ ] (Blocked until Step 1 succeeds)

## Step 3 — Documentation & reports
- [ ] Create ADR-003-Validation-Layer.md
- [ ] Create Phase3-Validation-Layer-Report-v1.0.md
- [ ] Update Foundation-Checklist.md
- [ ] Update Architecture.md
- [ ] Update Changelog.md

## Step 4 — Testing checklist
- [ ] Missing Fields
- [ ] Empty Values
- [ ] Wrong Types
- [ ] Invalid Email
- [ ] Invalid Product ID
- [ ] Invalid Quantity
- [ ] Invalid URL
- [ ] Invalid Boolean
- [ ] Invalid Numeric
- [ ] Unexpected Input

