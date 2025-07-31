import { readBody, defineEventHandler } from 'h3'
import { supabase } from '@/lib/supabase'

// 日本時間（JST）を取得する関数
function getJSTDate(): string {
  const now = new Date()
  const jstOffset = 9 * 60 // JSTはUTC+9
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  const jst = new Date(utc + (jstOffset * 60000))
  return jst.toISOString()
}

export async function clockOutHandler(event: any, opts?: {
  supabaseImpl?: typeof supabase,
  createErrorImpl?: (obj: any) => Error,
  readBodyImpl?: (event: any) => Promise<any>
}) {
  const _supabase = opts?.supabaseImpl || supabase
  const _createError = opts?.createErrorImpl || ((obj: any) => { throw new Error(obj.message) })
  const _readBody = opts?.readBodyImpl || (async (event: any) => await readBody(event))

  const body = await _readBody(event)
  const { userId } = body as { userId: number }

  if (!userId) {
    throw _createError({ statusCode: 400, message: 'userIdは必須です' })
  }

  // 本日の出勤打刻を検索（JST基準）
  const today = new Date()
  const jstOffset = 9 * 60
  const utc = today.getTime() + (today.getTimezoneOffset() * 60000)
  const jstToday = new Date(utc + (jstOffset * 60000))
  jstToday.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(jstToday)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data: clock, error: findError } = await _supabase
    .from('Clock')
    .select('*')
    .eq('userId', userId)
    .gte('clockIn', jstToday.toISOString())
    .lt('clockIn', tomorrow.toISOString())
    .is('clockOut', null)
    .single()

  if (findError) {
    throw _createError({ statusCode: 400, message: '本日の出勤打刻がありません' })
  }

  // 退勤打刻を更新（JST時刻）
  const { data: updatedClock, error: updateError } = await _supabase
    .from('Clock')
    .update({
      clockOut: getJSTDate()
    })
    .eq('id', clock.id)
    .select()
    .single()

  if (updateError) {
    throw _createError({ statusCode: 500, message: '退勤打刻に失敗しました' })
  }

  return {
    message: '退勤打刻が完了しました',
    clock: updatedClock
  }
}

export default defineEventHandler(clockOutHandler) 