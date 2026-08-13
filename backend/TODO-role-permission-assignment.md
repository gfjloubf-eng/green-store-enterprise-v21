# Phase 6D — Role ↔ Permission Assignment

## Steps
- [x] 1. Extend `role-repository-contract.ts` with assignment methods
- [x] 2. Implement methods in `role-repository.ts`
- [x] 3. Extend `role-service-contract.ts` with business methods
- [x] 4. Implement business logic in `role-service.ts` (inject PermissionRepositoryContract)
- [x] 5. Wire permission repo into `service-factory.ts`
- [x] 6. Add DTOs to `dto/role.ts`
- [x] 7. Add controller handlers in `modules/roles/controller.ts`
- [x] 8. Register 4 new routes in `modules/roles/routes.ts`
- [x] 9. `npm run build` (passed via tsc)
- [x] 10. `npx prisma validate --schema prisma/schema.prisma` (valid 🚀)
- [x] 11. Start backend & test the 4 endpoints (assign 201, check 200, duplicate 409, list 200, remove 204, remove-missing 404, role & permission intact)
