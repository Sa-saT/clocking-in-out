import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginHandler } from '../../../../server/api/auth/login.post'

const mockUser = { id: 1, email: 'test@example.com', password: 'pass123', name: 'テストユーザー' }

const prismaMock = {
  user: {
    findUnique: vi.fn()
  }
}
const jwtSignMock = vi.fn(function() { return 'mocked.jwt.token' })
const createErrorMock = vi.fn((obj) => new Error(obj.message))
const readBodyMock = vi.fn()

function makeEvent(body: any) {
  return { body, context: {}, req: {}, res: {} }
}

describe('login.post.ts', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('正常系: 正しいemail/passwordでJWTとユーザー情報を返す', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...mockUser })
    readBodyMock.mockResolvedValue({ email: mockUser.email, password: mockUser.password })
    const event = makeEvent({})
    const result = await loginHandler(event, {
      prismaImpl: prismaMock as any,
      jwtSignImpl: jwtSignMock,
      createErrorImpl: createErrorMock,
      readBodyImpl: readBodyMock
    })
    expect(result).toMatchObject({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      token: 'mocked.jwt.token'
    })
    expect(jwtSignMock).toHaveBeenCalled()
  })

  it('バリデーション: email/password未入力で400エラー', async () => {
    readBodyMock.mockResolvedValue({ email: '', password: '' })
    const event = makeEvent({})
    await expect(loginHandler(event, {
      prismaImpl: prismaMock as any,
      jwtSignImpl: jwtSignMock,
      createErrorImpl: createErrorMock,
      readBodyImpl: readBodyMock
    })).rejects.toThrow('メールアドレスとパスワードは必須です')
  })

  it('認証失敗: ユーザーが存在しない場合401エラー', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    readBodyMock.mockResolvedValue({ email: 'notfound@example.com', password: 'xxx' })
    const event = makeEvent({})
    await expect(loginHandler(event, {
      prismaImpl: prismaMock as any,
      jwtSignImpl: jwtSignMock,
      createErrorImpl: createErrorMock,
      readBodyImpl: readBodyMock
    })).rejects.toThrow('メールアドレスまたはパスワードが正しくありません')
  })

  it('認証失敗: パスワード不一致で401エラー', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, password: 'otherpass' })
    readBodyMock.mockResolvedValue({ email: mockUser.email, password: 'wrongpass' })
    const event = makeEvent({})
    await expect(loginHandler(event, {
      prismaImpl: prismaMock as any,
      jwtSignImpl: jwtSignMock,
      createErrorImpl: createErrorMock,
      readBodyImpl: readBodyMock
    })).rejects.toThrow('メールアドレスまたはパスワードが正しくありません')
  })
}) 