import * as jwt from 'jsonwebtoken'
import { defineEventHandler, getHeader } from 'h3'

const config = useRuntimeConfig()
const JWT_SECRET = config.jwtSecret

function getJwtVerify() {
  return (jwt as any).default?.verify || jwt.verify
}

export default defineEventHandler(async (event) => {
  // APIリクエストのみを対象とする
  if (!event.path?.startsWith('/api/')) {
    return
  }
  
  // 認証不要なAPIパスをスキップ
  const publicPaths = ['/api/auth/login', '/api/auth/debug']
  if (publicPaths.includes(event.path || '')) {
    return
  }

  console.log('🔍 Auth middleware processing:', event.path)

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: '認証が必要ですよんよん'
    })
  }

  const token = authHeader.substring(7)
  const _jwtVerify = getJwtVerify()

  try {
    const decoded = _jwtVerify(token, JWT_SECRET) as any
    event.context.user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: '無効なトークンです'
    })
  }
})