import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body as { email: string; password: string }

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'メールアドレスとパスワードは必須です' })
  }

  // ユーザー検索（nameも取得）
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, name: true },
  })
  if (!user || user.password !== password) {
    throw createError({ statusCode: 401, message: 'メールアドレスまたはパスワードが正しくありません' })
  }

  // JWT発行
  const token = jwt.sign(
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
}) 