import { PrismaClient } from '@prisma/client/edge'

// Vercelのサーバーレス環境用のPrismaClient初期化
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
