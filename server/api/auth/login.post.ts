import * as jwt from 'jsonwebtoken'
import { readBody, defineEventHandler } from 'h3'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

const config = useRuntimeConfig()
const JWT_SECRET = config.jwtSecret

function getJwtSign() {
  return (jwt as any).default?.sign || jwt.sign
}

export async function loginHandler(event: any, opts?: {
  supabaseImpl?: typeof supabase,
  jwtSignImpl?: (...args: any[]) => string,
  createErrorImpl?: (obj: any) => Error,
  readBodyImpl?: (event: any) => Promise<any>
}) {
  const _supabase = opts?.supabaseImpl || supabase
  const _createError = opts?.createErrorImpl || ((obj: any) => { throw new Error(obj.message) })
  const _readBody = opts?.readBodyImpl || (async (event: any) => await readBody(event))
  const _jwtSign = opts && opts.jwtSignImpl ? opts.jwtSignImpl : getJwtSign()

  const body = await _readBody(event)
  const { email, password } = body as { email: string; password: string }

  console.log('🔍 Login attempt:', { email, password: password ? '***' : 'undefined' })

  if (!email || !password) {
    throw _createError({ statusCode: 400, message: 'メールアドレスとパスワードは必須です' })
  }

  // ユーザー検索
  console.log('🔍 Searching for user:', email)
                const { data: user, error } = await _supabase
                .from('User')
                .select('id, email, password, name')
                .eq('email', email)
                .single()

  console.log('🔍 Database response:', { 
    userFound: !!user, 
    error: error?.message || null,
    userEmail: user?.email,
    userPassword: user?.password ? '***' : 'undefined'
  })

  if (error) {
    console.log('❌ Database error:', error)
    throw _createError({ statusCode: 401, message: 'メールアドレスまたはパスワードが正しくありません' })
  }

  if (!user) {
    console.log('❌ User not found')
    throw _createError({ statusCode: 401, message: 'メールアドレスまたはパスワードが正しくありません' })
  }

  console.log('🔍 Password comparison:', { 
    providedPassword: password, 
    storedPassword: user.password ? '***' : 'undefined',
    hasStoredPassword: !!user.password
  })

  if (!user.password) {
    console.log('❌ No stored password')
    throw _createError({ statusCode: 401, message: 'メールアドレスまたはパスワードが正しくありません' })
  }

                const passwordMatch = await bcrypt.compare(password, user.password)
              console.log('🔍 bcrypt comparison result:', passwordMatch)

  if (!passwordMatch) {
    console.log('❌ Password mismatch')
    throw _createError({ statusCode: 401, message: 'メールアドレスまたはパスワードが正しくありません' })
  }

  console.log('✅ Login successful for user:', user.email)

  // JWT発行
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