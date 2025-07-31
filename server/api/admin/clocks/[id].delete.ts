import { defineEventHandler } from 'h3'
import { supabase } from '@/lib/supabase'

export async function deleteClockHandler(event: any, opts?: {
  supabaseImpl?: typeof supabase,
  createErrorImpl?: (obj: any) => Error
}) {
  const _supabase = opts?.supabaseImpl || supabase
  const _createError = opts?.createErrorImpl || ((obj: any) => { throw new Error(obj.message) })

  // 管理者認証チェック
  const userEmail = event.context.user?.email
  if (userEmail !== 'admin@example.com') {
    throw _createError({ statusCode: 403, message: '認可エラー' })
  }

  const clockId = parseInt(event.context.params?.id)
  if (!clockId || isNaN(clockId)) {
    throw _createError({ statusCode: 400, message: '打刻IDが不正です' })
  }

  // 打刻削除
const { error } = await _supabase
    .from('Clock')
    .delete()
    .eq('id', clockId)

  if (error) {
    throw _createError({ statusCode: 500, message: '削除に失敗しました' })
  }

  return {
    message: '打刻を削除しました'
  }
}

export default defineEventHandler(deleteClockHandler) 