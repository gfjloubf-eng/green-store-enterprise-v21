# ADR-001-Database-Layer

## Status
Accepted

## Context
Green Store Enterprise Foundation v1.1 requires a stable, testable, and secure Database Layer. Historically, the project used `db.php` as a direct entry point to create/use a PDO instance and several scripts accessed PDO directly.

We already introduced `App\Core\Database` as the centralized database connection holder, implemented as a Singleton with PDO error handling and unified configuration from `config/database.php` and `.env`.

## Decision
1. **Create a centralized Database Layer** via `App\Core\Database`.
2. **Keep `db.php` as a Legacy Compatibility Layer** and do not remove it during Phase 1.
3. **Gradually refactor** existing entry points (e.g., `api.php`, `save_order.php`) and backend models to use `App\Core\Database` as the connection gateway.
4. Prefer `App\Core\Database` methods (`query`, `prepare`, `execute`, transactions) as the design direction. Avoid direct PDO usage in new code.

## Why we created the Database Layer?
- To avoid scattered database connection logic across the codebase.
- To ensure consistent configuration and error handling.
- To enable future refactors (Repository/Service layers) without rewriting all database entry points.
- To support a controlled evolution towards eliminating direct PDO usage.

## Why didn't we delete `db.php`?
- `db.php` currently provides backward compatibility by exposing `$pdo` for legacy scripts.
- Removing it immediately would break existing pages/scripts that still rely on it.
- Phase 1 is an enterprise foundation; we aim for stability and incremental change.

## Why did we use Singleton in this phase?
- A single PDO connection per request reduces resource usage and prevents connection storms.
- It provides a consistent lifecycle for the connection during incremental refactoring.
- It simplifies integration: controllers/services/models can reliably obtain the same connection.

## Why did we keep Backward Compatibility?
- The project contains legacy PHP scripts that include/use `db.php`.
- Incremental refactoring lowers risk and preserves existing functionality while we migrate.

## Future plan (v1.2 and beyond)
- Reduce/avoid usage of `App\Core\Database::getConnection()` in application code.
- Introduce Repositories that depend on `App\Core\Database` abstraction (not on raw PDO).
- Move towards a design where controllers/services never touch PDO directly.
- Eventually deprecate and (in a later release) remove legacy `db.php` once all entry points are migrated.

