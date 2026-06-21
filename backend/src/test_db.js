import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to Neon DB...');
  const start = Date.now();
  try {
    const users = await prisma.user.findMany({ take: 5 });
    console.log('Successfully fetched users:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));
    console.log(`Query took ${Date.now() - start}ms`);
  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
