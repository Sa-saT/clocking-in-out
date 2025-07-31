import { getQuery, defineEventHandler } from 'h3'
import { supabase } from '@/lib/supabase'

export async function clockHistoryHandler(event: any, opts?: {
  supabaseImpl?: typeof supabase,
  createErrorImpl?: (obj: any) => Error,
  getQueryImpl?: (event: any) => any
}) {
  const _supabase = opts?.supabaseImpl || supabase
  const _createError = opts?.createErrorImpl || ((obj: any) => { throw new Error(obj.message) })
  const _getQuery = opts?.getQueryImpl || (async (event: any) => await getQuery(event))

  const query = await _getQuery(event)
  const { userId } = query as { userId: string }

  if (!userId) {
    throw _createError({ statusCode: 400, message: 'userIdは必須です' })
  }

  // 認証チェック（簡易版、実際はJWTトークンから取得したユーザーIDと比較すべき）
  // ここでは管理者のみが他ユーザーの履歴を取得可能とする
  const userEmail = event.context.user?.email
  const isAdmin = userEmail === 'admin@example.com'
  
  if (!isAdmin && parseInt(userId) !== event.context.user?.id) {
    throw _createError({ statusCode: 403, message: '他ユーザーの履歴取得はできません' })
  }

  // 打刻履歴を取得
const { data: clocks, error } = await _supabase
    .from('Clock')
    .select('*')
    .eq('userId', userId)
    .order('clockIn', { ascending: false })

  if (error) {
    throw _createError({ statusCode: 500, message: '履歴取得に失敗しました' })
  }

  return {
    clocks: clocks || []
  }
}

export default defineEventHandler(clockHistoryHandler) 