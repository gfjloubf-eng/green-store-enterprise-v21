(async ()=>{
  const { createSystemRoutes } = require('../dist/system/routes');
  const { createAuthRoutes } = require('../dist/modules/auth/routes');
  const user = require('../dist/modules/users/routes');
  const role = require('../dist/modules/roles/routes');

  const routes = [...createSystemRoutes(), ...createAuthRoutes(), ...user.createUserRoutes(), ...role.createRoleRoutes()];
  for (const r of routes) {
    console.log(r.method, r.path, r.version, r.name);
  }
  process.exit(0);
})();
