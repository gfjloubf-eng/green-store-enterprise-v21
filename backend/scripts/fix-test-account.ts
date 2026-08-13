import PrismaService from '../src/repositories/prisma-service';
import PasswordService from '../src/services/auth-password-service';

async function main() {
  const email = 'samsd.sdf@gmail.com';
  const client = PrismaService.getClient();

  if (!process.env.DATABASE_URL) {
    console.error(JSON.stringify({ error: 'missing_database_url' }));
    process.exit(2);
  }

  try {
    const countsBefore = {
      users: await client.user.count(),
      roles: await client.role.count(),
      permissions: await client.permission.count(),
      user_roles: await client.userRole.count(),
      role_permissions: await client.rolePermission.count(),
      products: await client.product.count(),
    };

    const user = await client.user.findUnique({ where: { email } });

    const result: any = {
      countsBefore,
      userExists: !!user,
      userActive: user ? !!user.isActive : null,
      passwordHashPresentBefore: user ? !!user.passwordHash : null,
    };

    if (!user) {
      console.log(JSON.stringify(result));
      process.exit(3);
    }

    // Only act if passwordHash is missing/null
    if (!user.passwordHash) {
      const hashed = await PasswordService.hash('Ammar@123');
      await client.user.update({ where: { id: user.id }, data: { passwordHash: hashed } });
    }

    const updatedUser = await client.user.findUnique({ where: { email } });

    const countsAfter = {
      users: await client.user.count(),
      roles: await client.role.count(),
      permissions: await client.permission.count(),
      user_roles: await client.userRole.count(),
      role_permissions: await client.rolePermission.count(),
      products: await client.product.count(),
    };

    result.countsAfter = countsAfter;
    result.passwordHashPresentAfter = updatedUser ? !!updatedUser.passwordHash : null;

    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (err: any) {
    console.error(JSON.stringify({ error: String(err.message ?? err) }));
    process.exit(1);
  } finally {
    try {
      await PrismaService.disconnect();
    } catch (e) {
      // ignore
    }
  }
}

main();
