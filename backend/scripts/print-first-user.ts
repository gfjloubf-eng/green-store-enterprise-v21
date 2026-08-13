import PrismaService from '../src/repositories/prisma-service'; 
 
async function main(){ 
  const client = PrismaService.getClient(); 
  const u = await client.user.findFirst({ select: { id: true, email: true } }); 
  console.log(JSON.stringify(u)); 
  process.exit(0); 
} 
 
main().catch(e=>{ console.error(e); process.exit(1); });
