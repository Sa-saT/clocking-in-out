import { readBody, defineEventHandler } from 'h3'
import { supabase } from '@/lib/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, tableName = 'User' } = body as { email: string; tableName?: string }

  if (!email) {
    return { error: 'email is required' }
  }

  try {
    // テーブル名を指定してユーザー検索（デバッグ用）
    const { data: user, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      return { 
        error: 'Database error', 
        details: error,
        message: error.message,
        code: error.code,
        tableName: tableName
      }
    }

    if (!user) {
      return { 
        error: 'User not found',
        searchedEmail: email,
        tableName: tableName
      }
    }

    // パスワードは除外して返す
    const { password, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      hasPassword: !!password,
      passwordLength: password ? password.length : 0,
      tableName: tableName
    }
  } catch (error) {
    return {
      error: 'Unexpected error',
      details: error
    }
  }
}) 