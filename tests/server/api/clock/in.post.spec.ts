import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

// prismaのimportをESMモック（ファクトリー関数内でmockPrismaを定義）
const fixedDate = new Date('2023-01-01T09:00:00Z')
vi.mock('@/lib/prisma', () => {
  const mockPrisma = {
    clock: {
      updateMany: vi.fn(),
      findFirst: vi.fn(() => null),
      create: vi.fn(() => ({ id: 1, userId: 1, clockIn: fixedDate }))
    }
  }
  return {
    __esModule: true,
    default: mockPrisma
  }
})

import { clockInHandler } from '../../../../server/api/clock/clockInHandler'

describe('POST /api/clock/in', () => {
  const mockReadBody = (event: any) => event._body ?? {}

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fixedDate)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('userIdが無い場合400エラー', async () => {
    const event = { _body: {}, context: {} }
    await expect(clockInHandler(event, { readBodyImpl: mockReadBody })).rejects.toThrowError('userIdは必須です')
  })

  it('正常時はsuccessとclockを返す', async () => {
    const event = { _body: { userId: 1 }, context: {} }
    const result = await clockInHandler(event, { readBodyImpl: mockReadBody })
    expect(result.success).toBe(true)
    expect(result.clock).toBeDefined()
    expect(result.clock.userId).toBe(1)
  })
}) 