# Database Foundation Plan

This document captures the enterprise-ready database foundation for Qutoof Nature ERP.

## Vision

The future backend will use Node.js, Prisma ORM, and Supabase-hosted PostgreSQL. The database foundation is designed for:
- secure production use
- defense-in-depth
- least privilege
- audit readiness
- RLS and RBAC readiness
- future multi-store / multi-branch support
- soft delete lifecycle management

## Database Provider

- Supabase PostgreSQL
- All connection details must be sourced from environment variables only.
- No secrets are hardcoded.

## Environment Variables

Required environment variables:
- DATABASE_URL
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- JWT_SECRET
- REFRESH_TOKEN_SECRET
- COOKIE_SECRET
- ENCRYPTION_KEY
- SHADOW_DATABASE_URL (optional, used for Prisma migrations)

## Prisma Foundation

- `prisma/schema.prisma` exists as the canonical future schema file.
- Generator configuration uses `prisma-client-js`.
- Datasource is configured for PostgreSQL via `DATABASE_URL`.
- Shadow database support is prepared via `SHADOW_DATABASE_URL`.
- No models are defined yet to preserve the milestone scope.

## Global Conventions

Future models should follow these standards:
- UUID primary keys for all entities.
- `createdAt` and `updatedAt` timestamps for audit and synchronization.
- `deletedAt` timestamp for soft deletes.
- Use soft delete rather than hard delete for business entities.
- Use explicit indexes and unique constraints where appropriate.
- Build audit-ready entities with user or system audit fields in future versions.
- Design for RLS using Supabase policies and role-based access control.
- Keep database access within Prisma Client only.
- Avoid raw SQL unless absolutely necessary.

## Future Database Domains

The ERP foundation should plan for the following domains:
- Authentication
- Users
- Roles
- Permissions
- Stores
- Branches
- Suppliers
- Categories
- Subcategories
- Products
- Product Images
- Inventory
- Inventory Transactions
- Customers
- Addresses
- Shopping Cart
- Favorites
- Orders
- Order Items
- Payments
- Delivery
- Coupons
- Notifications
- Reviews
- Reports
- Settings
- Audit Logs

## Security Principles

- Do not expose secrets in code or committed files.
- Use environment variables for all secrets.
- Use separate keys for JWT, refresh tokens, cookies, and encryption.
- Prepare for future secret rotation by keeping environment-driven configuration.
- Keep `.env` ignored and only provide `.env.example`.

## Non-breaking Policy

- This milestone does not introduce business models, tables, migrations, APIs, or authentication flows.
- Existing frontend behavior must remain unchanged.
- The database foundation is preparatory only.
