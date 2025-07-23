import { describe, it, expect, vi, beforeEach } from 'vitest'

// PrismaClientのモック
class MockPrismaClient {
  static instanceCount = 0
  constructor() {
    MockPrismaClient.instanceCount++
  }
}

describe('lib/prisma', () => {
  beforeEach(() => {
    // グローバルをリセット
    // @ts-ignore
    delete globalThis.prismaGlobal
    MockPrismaClient.instanceCount = 0
    vi.resetModules()
  })

  it('初回import時は新規インスタンス生成', async () => {
    vi.doMock('@prisma/client', () => ({ PrismaClient: MockPrismaClient }))
    const prisma = (await import('../../lib/prisma')).default
    expect(prisma).toBeInstanceOf(MockPrismaClient)
    expect(MockPrismaClient.instanceCount).toBe(1)
  })

  it('2回目以降はグローバルを再利用', async () => {
    vi.doMock('@prisma/client', () => ({ PrismaClient: MockPrismaClient }))
    // 1回目
    const prisma1 = (await import('../../lib/prisma')).default
    // 2回目
    const prisma2 = (await import('../../lib/prisma')).default
    expect(prisma1).toBe(prisma2)
    expect(MockPrismaClient.instanceCount).toBe(1)
  })
}) 