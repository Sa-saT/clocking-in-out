import { PrismaClient } from '@prisma/client'

// グローバルにPrismaClientインスタンスを保持
declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

try {
  // グローバルにインスタンスがあればそれを使い、なければ新規生成
  prisma = globalThis.prisma ?? new PrismaClient()
  
  // 開発環境でのみグローバルに保存（ホットリロード時の多重生成防止）
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma
  }
  
  console.log('PrismaClient initialized successfully')
} catch (error) {
  console.error('Failed to initialize PrismaClient:', error)
  throw error
}

export default prisma
