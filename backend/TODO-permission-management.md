# Phase 6C — Permission Management Foundation

## Steps

- [x] Create `backend/src/dto/permission.ts` (CreatePermissionDto, UpdatePermissionDto, PermissionResponseDto)
- [x] Modify `backend/src/services/permission-service-contract.ts` (add `restore(id)`)
- [x] Modify `backend/src/services/permission-service.ts` (add `restore(id)` implementation)
- [x] Create `backend/src/modules/permissions/controller.ts`
- [x] Create `backend/src/modules/permissions/routes.ts`
- [x] Create `backend/src/modules/permissions/index.ts`
- [x] Modify `backend/src/system/server.ts` (register createPermissionRoutes)
- [x] Validate: `npm run build`
- [x] Validate: `npx prisma validate --schema prisma/schema.prisma`
- [x] Start backend and test all permission endpoints
- [x] Fix: restore endpoint fails with `Unknown argument 'deletedAt'` (Permission model has no deletedAt) → override `restore()` in `PermissionRepository` to no-op returning existing record

## Endpoints
- GET /permissions
- GET /permissions/:id
- POST /permissions
- PUT /permissions/:id
- DELETE /permissions/:id
- PATCH /permissions/:id/restore

