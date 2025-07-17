import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clockOutHandler } from '../../../../server/api/clock/out.post'

describe('POST /api/clock/out', () => {
  const mockReadBody = (event: any) => event._body ?? {}
  let mockPrisma: any

  beforeEach(() => {
    mockPrisma = {
      clock: {
        findFirst: vi.fn(() => null),
        update: vi.fn(() => ({ id: 1, userId: 1, clockIn: new Date(), clockOut: new Date() }))
      }
    }
    vi.stubGlobal('createError', ({ statusCode, message }: { statusCode: number; message: string }) => {
      const err = new Error(message) as Error & { statusCode: number }
      err.statusCode = statusCode
      return err
    })
  })

  it('userIdが無い場合400エラー', async () => {
    const event = { _body: {}, context: {} } as any
    await expect(clockOutHandler(event, { readBodyImpl: mockReadBody, prismaImpl: mockPrisma, createErrorImpl: globalThis.createError })).rejects.toThrow('userIdは必須です')
  })

  it('本日未出勤ならエラー', async () => {
    const event = { _body: { userId: 1 }, context: {} } as any
    mockPrisma.clock.findFirst.mockResolvedValue(null)
    await expect(clockOutHandler(event, { readBodyImpl: mockReadBody, prismaImpl: mockPrisma, createErrorImpl: globalThis.createError })).rejects.toThrow('本日の出勤打刻がありません')
  })

  it('正常時はsuccessとclockを返す', async () => {
    const event = { _body: { userId: 1 }, context: {} } as any
    const fakeClock = { id: 1, userId: 1, clockIn: new Date(), clockOut: null }
    mockPrisma.clock.findFirst.mockResolvedValue(fakeClock)
    mockPrisma.clock.update.mockResolvedValue({ ...fakeClock, clockOut: new Date() })
    const result = await clockOutHandler(event, { readBodyImpl: mockReadBody, prismaImpl: mockPrisma, createErrorImpl: globalThis.createError })
    expect(result.success).toBe(true)
    expect(result.clock).toBeTruthy()
    expect(result.clock.clockOut).toBeInstanceOf(Date)
  })
}) 