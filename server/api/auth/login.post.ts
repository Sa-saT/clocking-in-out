import { PrismaClient } from '@prisma/client'
import * as jwt from 'jsonwebtoken'
import { readBody, defineEventHandler } from 'h3'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key'

function getJwtSign() {
  // ESM/CJS両対応
  return (jwt as any).default?.sign || jwt.sign
}

export async function loginHandler(event: any, opts?: {
  prismaImpl?: typeof prisma,
  jwtSignImpl?: (...args: any[]) => string,
  createErrorImpl?: (obj: any) => Error,
  readBodyImpl?: (event: any) => Promise<any>
}) {
  const _prisma = opts?.prismaImpl || prisma
  const _createError = opts?.createErrorImpl || ((obj: any) => { throw new Error(obj.message) })
  const _readBody = opts?.readBodyImpl || (async (event: any) => await readBody(event))
  const _jwtSign = opts && opts.jwtSignImpl ? opts.jwtSignImpl : getJwtSign()

  // デバッグ: _jwtSignがmockかどうか出力
  if (typeof _jwtSign === 'function' && _jwtSign.name === 'mockConstructor') {
    // vitestのmock関数
    // eslint-disable-next-line no-console
    console.log('jwtSignImpl is vitest mock')
  } else {
    // eslint-disable-next-line no-console
    console.log('jwtSignImpl is not mock:', _jwtSign)
  }

  const body = await _readBody(event)
  const { email, password } = body as { email: string; password: string }

  if (!email || !password) {
    throw _createError({ statusCode: 400, message: 'メールアドレスとパスワードは必須です' })
  }

  // ユーザー検索（nameも取得）
  const user = await _prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, name: true },
  })
  if (!user || user.password !== password) {
    throw _createError({ statusCode: 401, message: 'メールアドレスまたはパスワードが正しくありません' })
  }

  // JWT発行
  // eslint-disable-next-line no-console
  console.log('jwtSign call args:', { sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1d' })
  const token = _jwtSign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '1d' }
  )

  // 認証成功時、ユーザー情報とJWTを返却（パスワードは除外）
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    token,
  }
}

export default defineEventHandler(loginHandler) 