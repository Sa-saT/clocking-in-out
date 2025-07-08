import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key'

export function requireAuth(event: H3Event) {
  const authHeader = event.node.req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: '認証トークンが必要です' })
  }
  const token = authHeader.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    // contextに認証ユーザー情報を格納
    event.context.auth = payload
    return payload
  } catch {
    throw createError({ statusCode: 401, message: 'トークンが無効です' })
  }
}

// 管理者認可（将来role拡張時はpayload.role === 'admin'に切替）
export function requireAdmin(event: H3Event) {
  const payload = requireAuth(event) as any
  if (!payload || typeof payload.email !== 'string' || payload.email !== 'admin@example.com') {
    throw createError({ statusCode: 403, message: '管理者権限が必要です' })
  }
  return payload
} 