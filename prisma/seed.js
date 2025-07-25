import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
const prisma = new PrismaClient();

async function main() {
  console.log('seed start');
  const adminPass = await bcrypt.hash('adminpass', 10)
  const userPass = await bcrypt.hash('userpass1', 10)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPass,
      name: '管理者',
      auth_uid: uuidv4(),
    },
  });
  await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: userPass,
      name: '一般ユーザー',
      auth_uid: uuidv4(),
    },
  });
  console.log('Seed: ユーザー投入完了');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect()); 