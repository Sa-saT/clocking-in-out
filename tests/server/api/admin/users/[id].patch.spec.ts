import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateUserHandler } from '../../../../../server/api/admin/users/[id].patch'

describe('PATCH /api/admin/users/[id]', () => {
  let mockPrisma: any
  let mockRequireAdmin: any
  let mockReadBody: any

  beforeEach(() => {
    mockPrisma = {
      user: {
        update: vi.fn(() => ({ id: 1, name: '新しい名前', email: 'new@example.com' }))
      }
    }
    vi.stubGlobal('createError', ({ statusCode, message }: { statusCode: number; message: string }) => {
      const err = new Error(message) as Error & { statusCode: number }
      err.statusCode = statusCode
      return err
    })
    mockRequireAdmin = vi.fn()
    mockReadBody = vi.fn()
  })

  it('idが無い場合400エラー', async () => {
    mockRequireAdmin.mockImplementation(() => {})
    mockReadBody.mockResolvedValue({ name: 'a', email: 'a@example.com' })
    const event = { context: { params: {} } } as any
    await expect(updateUserHandler(event, { prismaImpl: mockPrisma, createErrorImpl: globalThis.createError, requireAdminImpl: mockRequireAdmin, readBodyImpl: mockReadBody })).rejects.toThrow('ユーザーIDが不正です')
  })

  it('名前バリデーションエラー', async () => {
    mockRequireAdmin.mockImplementation(() => {})
    mockReadBody.mockResolvedValue({ name: '', email: 'a@example.com' })
    const event = { context: { params: { id: 1 } } } as any
    await expect(updateUserHandler(event, { prismaImpl: mockPrisma, createErrorImpl: globalThis.createError, requireAdminImpl: mockRequireAdmin, readBodyImpl: mockReadBody })).rejects.toThrow('名前は必須・50文字以内です')
  })

  it('メールアドレスバリデーションエラー', async () => {
    mockRequireAdmin.mockImplementation(() => {})
    mockReadBody.mockResolvedValue({ name: 'a', email: 'invalid' })
    const event = { context: { params: { id: 1 } } } as any
    await expect(updateUserHandler(event, { prismaImpl: mockPrisma, createErrorImpl: globalThis.createError, requireAdminImpl: mockRequireAdmin, readBodyImpl: mockReadBody })).rejects.toThrow('メールアドレス形式が不正です')
  })

  it('認可エラー時は例外', async () => {
    mockRequireAdmin.mockImplementation(() => { throw new Error('認可エラー') })
    mockReadBody.mockResolvedValue({ name: 'a', email: 'a@example.com' })
    const event = { context: { params: { id: 1 } } } as any
    await expect(updateUserHandler(event, { prismaImpl: mockPrisma, createErrorImpl: globalThis.createError, requireAdminImpl: mockRequireAdmin, readBodyImpl: mockReadBody })).rejects.toThrow('認可エラー')
  })

  it('DBエラー時は400エラー', async () => {
    mockRequireAdmin.mockImplementation(() => {})
    mockReadBody.mockResolvedValue({ name: 'a', email: 'a@example.com' })
    mockPrisma.user.update.mockRejectedValue(new Error('DB error'))
    const event = { context: { params: { id: 1 } } } as any
    await expect(updateUserHandler(event, { prismaImpl: mockPrisma, createErrorImpl: globalThis.createError, requireAdminImpl: mockRequireAdmin, readBodyImpl: mockReadBody })).rejects.toThrow('更新に失敗しました')
  })

  it('正常時はsuccessとuserを返す', async () => {
    mockRequireAdmin.mockImplementation(() => {})
    mockReadBody.mockResolvedValue({ name: '新しい名前', email: 'new@example.com' })
    const event = { context: { params: { id: 1 } } } as any
    const result = await updateUserHandler(event, { prismaImpl: mockPrisma, createErrorImpl: globalThis.createError, requireAdminImpl: mockRequireAdmin, readBodyImpl: mockReadBody })
    expect(result.success).toBe(true)
    expect(result.user).toBeTruthy()
    expect(result.user.name).toBe('新しい名前')
  })
}) 