import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clockInHandler } from './in.post'

describe('POST /api/clock/in', () => {
  const mockReadBody = (event: any) => event._body ?? {}

  beforeEach(() => {
    // prismaのモック
    vi.stubGlobal('prisma', {
      clock: {
        updateMany: vi.fn(),
        findFirst: vi.fn(() => null),
        create: vi.fn(() => ({ id: 1, userId: 1, clockIn: new Date() }))
      }
    })
    // createErrorのモック
    vi.stubGlobal('createError', ({ statusCode, message }: { statusCode: number; message: string }) => {
      const err = new Error(message) as Error & { statusCode: number }
      err.statusCode = statusCode
      return err
    })
  })

  it('userIdが無い場合400エラー', async () => {
    const event = { _body: {}, context: {} } as any
    await expect(clockInHandler(event, { readBodyImpl: mockReadBody })).rejects.toThrow('userIdは必須です')
  })

  it('正常時はsuccessとclockを返す', async () => {
    const event = { _body: { userId: 1 }, context: {} } as any
    const result = await clockInHandler(event, { readBodyImpl: mockReadBody })
    expect(result.success).toBe(true)
    expect(result.clock).toBeTruthy()
  })
}) 