import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('seed start')
  // 管理者ユーザー
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'adminpass',
      name: '管理者',
    },
  })
  // 一般ユーザー
  await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: 'userpass1',
      name: '一般ユーザー',
    },
  })
  console.log('Seed: ユーザー投入完了')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect()) 