import { PrismaClient } from '@prisma/client'

// PrismaClientのインスタンス生成関数（毎回新規生成）
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// グローバルスコープに型を拡張（prismaGlobalを追加）
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// すでにグローバルにインスタンスがあればそれを使い、なければ新規生成
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

// 開発環境ではグローバルにインスタンスを保持（ホットリロード時の多重生成防止）
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
