import { readBody, defineEventHandler } from 'h3'
import { supabase } from '@/lib/supabase'

export async function updateClockHandler(event: any, opts?: {
  supabaseImpl?: typeof supabase,
  createErrorImpl?: (obj: any) => Error,
  readBodyImpl?: (event: any) => Promise<any>
}) {
  const _supabase = opts?.supabaseImpl || supabase
  const _createError = opts?.createErrorImpl || ((obj: any) => { throw new Error(obj.message) })
  const _readBody = opts?.readBodyImpl || (async (event: any) => await readBody(event))

  // 管理者認証チェック
  const userEmail = event.context.user?.email
  if (userEmail !== 'admin@example.com') {
    throw _createError({ statusCode: 403, message: '認可エラー' })
  }

  const clockId = parseInt(event.context.params?.id)
  if (!clockId || isNaN(clockId)) {
    throw _createError({ statusCode: 400, message: '打刻IDが不正です' })
  }

  const body = await _readBody(event)
  const { clockIn, clockOut } = body as { clockIn?: string; clockOut?: string }

  // 更新データの構築
  const updateData: any = {}
  if (clockIn !== undefined) updateData.clockIn = clockIn
  if (clockOut !== undefined) updateData.clockOut = clockOut

  if (Object.keys(updateData).length === 0) {
    throw _createError({ statusCode: 400, message: '更新するデータがありません' })
  }

  // 打刻更新
const { data: updatedClock, error } = await _supabase
    .from('Clock')
    .update(updateData)
    .eq('id', clockId)
    .select('*')
    .single()

  if (error) {
    throw _createError({ statusCode: 500, message: '更新に失敗しました' })
  }

  return {
    message: '打刻情報を更新しました',
    clock: updatedClock
  }
}

export default defineEventHandler(updateClockHandler) 