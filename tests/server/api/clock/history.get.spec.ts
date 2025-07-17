import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clockHistoryHandler } from '../../../../server/api/clock/history.get'

describe('GET /api/clock/history', () => {
  let mockPrisma: any
  let mockRequireAuth: any
  let mockGetQuery: any

  beforeEach(() => {
    mockPrisma = {
      clock: {
        findMany: vi.fn(() => [{ id: 1, userId: 1, clockIn: new Date(), clockOut: new Date() }])
      }
    }
    vi.stubGlobal('createError', ({ statusCode, message }: { statusCode: number; message: string }) => {
      const err = new Error(message) as Error & { statusCode: number }
      err.statusCode = statusCode
      return err
    })
    mockRequireAuth = vi.fn()
    mockGetQuery = vi.fn()
  })

  it('userIdが無い場合400エラー', async () => {
    mockRequireAuth.mockReturnValue({ sub: '1', email: 'user1@example.com' })
    mockGetQuery.mockReturnValue({})
    const event = { context: {} } as any
    await expect(clockHistoryHandler(event, { prismaImpl: mockPrisma, createErrorImpl: globalThis.createError, requireAuthImpl: mockRequireAuth, getQueryImpl: mockGetQuery })).rejects.toThrow('userIdは必須です')
  })

  it('他ユーザーアクセス時は403エラー', async () => {
    mockRequireAuth.mockReturnValue({ sub: '2', email: 'user2@example.com' })
    mockGetQuery.mockReturnValue({ userId: 1 })
    const event = { context: {} } as any
    await expect(clockHistoryHandler(event, { prismaImpl: mockPrisma, createErrorImpl: globalThis.createError, requireAuthImpl: mockRequireAuth, getQueryImpl: mockGetQuery })).rejects.toThrow('他ユーザーの履歴取得はできません')
  })

  it('管理者は他ユーザーの履歴取得可能', async () => {
    mockRequireAuth.mockReturnValue({ sub: '999', email: 'admin@example.com' })
    mockGetQuery.mockReturnValue({ userId: 1 })
    const event = { context: {} } as any
    const result = await clockHistoryHandler(event, { prismaImpl: mockPrisma, createErrorImpl: globalThis.createError, requireAuthImpl: mockRequireAuth, getQueryImpl: mockGetQuery })
    expect(result.success).toBe(true)
    expect(Array.isArray(result.clocks)).toBe(true)
  })

  it('正常時はsuccessとclocksを返す', async () => {
    mockRequireAuth.mockReturnValue({ sub: '1', email: 'user1@example.com' })
    mockGetQuery.mockReturnValue({ userId: 1 })
    const event = { context: {} } as any
    const result = await clockHistoryHandler(event, { prismaImpl: mockPrisma, createErrorImpl: globalThis.createError, requireAuthImpl: mockRequireAuth, getQueryImpl: mockGetQuery })
    expect(result.success).toBe(true)
    expect(Array.isArray(result.clocks)).toBe(true)
  })
}) 