import { defineEventHandler } from 'h3'
import { supabase } from '@/lib/supabase'

export async function getUsersHandler(event: any, opts?: {
  supabaseImpl?: typeof supabase,
  createErrorImpl?: (obj: any) => Error
}) {
  const _supabase = opts?.supabaseImpl || supabase
  const _createError = opts?.createErrorImpl || ((obj: any) => { throw new Error(obj.message) })

  // 管理者認証チェック
  const userEmail = event.context.user?.email
  if (userEmail !== 'admin@example.com') {
    throw _createError({ statusCode: 403, message: '管理者権限が必要です' })
  }

  // ユーザー一覧を取得（パスワードは除外）
  const { data: users, error } = await _supabase
    .from('User')
    .select('id, email, name')
    .order('id', { ascending: false })

  if (error) {
    throw _createError({ statusCode: 500, message: 'ユーザー一覧の取得に失敗しました' })
  }

  return {
    users: users || []
  }
}

export default defineEventHandler(getUsersHandler) 