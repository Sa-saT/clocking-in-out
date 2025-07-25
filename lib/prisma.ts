import { PrismaClient } from '@prisma/client'

// グローバルにPrismaClientインスタンスを保持
declare global {
  var prisma: PrismaClient | undefined
}

// グローバルにインスタンスがあればそれを使い、なければ新規生成
const prisma = globalThis.prisma ?? new PrismaClient()

// 開発環境でのみグローバルに保存（ホットリロード時の多重生成防止）
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma
