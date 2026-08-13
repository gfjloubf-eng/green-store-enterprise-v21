# TODO - Sprint 4: Service Layer (OrderService)

## Plan checkpoints
- [x] Inspect `save_order.php` business orchestration flow.
- [x] Implement `app/Services/OrderService.php` moving business orchestration out of `save_order.php`.
- [x] Update `save_order.php` to delegate to `OrderService` while keeping validation calls, transaction boundaries, and Response calls in `save_order.php`.
- [ ] Run local verification tests (valid order + invalid product + invalid quantity + empty cart + invalid JSON).
- [ ] Confirm backward compatibility: same JSON structure, messages, and HTTP status codes.
- [ ] Stop after Sprint completion.

