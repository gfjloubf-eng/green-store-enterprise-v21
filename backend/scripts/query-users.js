const { PrismaClient } = require('@prisma/client');

async function main() {
  const client = new PrismaClient();
  try {
    const u = await client.user.findFirst({ select: { id: true, email: true } });
    console.log(JSON.stringify(u));
  } catch (e) {
    console.error(e && e.message ? e.message : e);
    process.exit(1);
  } finally {
    await client.$disconnect();
  }
}

main();
