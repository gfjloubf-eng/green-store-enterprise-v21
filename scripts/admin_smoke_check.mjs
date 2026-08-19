import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const checks = [
  ['frontend-react/src/App.tsx', /admin\/customers/, 'مسارات العملاء'],
  ['frontend-react/src/App.tsx', /admin\/support/, 'مسارات خدمة العملاء'],
  ['frontend-react/src/App.tsx', /admin\/orders/, 'مسارات الطلبات'],
  ['frontend-react/src/App.tsx', /admin\/drivers/, 'مسارات الموصلين'],
  ['frontend-react/src/App.tsx', /admin\/suppliers/, 'مسارات الموردين'],
  ['frontend-react/src/App.tsx', /admin\/reports/, 'مسارات التقارير'],
  ['frontend-react/src/config/navigation.ts', /requiredRoles: \['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE'\]/, 'حارس أدوار الإدارة'],
  ['backend/src/rbac/constants.ts', /delivery:\s*createPermissionMap/, 'صلاحيات التوصيل'],
  ['frontend-react/api/_backend/rbac/constants.ts', /delivery:\s*createPermissionMap/, 'مزامنة صلاحيات التوصيل'],
  ['frontend-react/src/features/reports/pages/ReportsDashboardPage.tsx', /ر\.ي/, 'عملة التقارير اليمنية'],
];

const failures = [];
for (const [relative, pattern, label] of checks) {
  const content = await readFile(join(root, relative), 'utf8');
  if (!pattern.test(content)) failures.push(`${label}: ${relative}`);
}

const report = await readFile(join(root, 'frontend-react/src/features/reports/pages/ReportsDashboardPage.tsx'), 'utf8');
if (/ر\.س|ar-SA/.test(report)) failures.push('بقايا صياغة سعودية في صفحة التقارير');

if (failures.length) {
  console.error('ADMIN_SMOKE_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`ADMIN_SMOKE_PASS checks=${checks.length + 1}`);
