import { readBody, defineEventHandler } from 'h3'
import { supabase } from '@/lib/supabase'

// 日本時間（JST）を取得する関数
function getJSTDate(): string {
  const now = new Date()
  // UTC時刻をJSTに変換
  const jst = new Date(now.getTime() + (9 * 60 * 60 * 1000))
  return jst.toISOString()
}

// JST基準で今日の開始時刻を取得
function getJSTTodayStart(): string {
  const now = new Date()
  // UTC時刻をJSTに変換
  const jst = new Date(now.getTime() + (9 * 60 * 60 * 1000))
  // 今日の00:00:00に設定
  jst.setHours(0, 0, 0, 0)
  return jst.toISOString()
}

// JST基準で明日の開始時刻を取得
function getJSTTomorrowStart(): string {
  const now = new Date()
  // UTC時刻をJSTに変換
  const jst = new Date(now.getTime() + (9 * 60 * 60 * 1000))
  // 明日の00:00:00に設定
  jst.setDate(jst.getDate() + 1)
  jst.setHours(0, 0, 0, 0)
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
  const jstTodayStart = getJSTTodayStart()
  const jstTomorrowStart = getJSTTomorrowStart()

  console.log('🔍 Clock-out: JST Today Start:', jstTodayStart)
  console.log('🔍 Clock-out: JST Tomorrow Start:', jstTomorrowStart)

  const { data: clock, error: findError } = await _supabase
    .from('Clock')
    .select('*')
    .eq('userId', userId)
    .gte('clockIn', jstTodayStart)
    .lt('clockIn', jstTomorrowStart)
    .is('clockOut', null)
    .single()

  if (findError) {
    console.log('🔍 Clock-out: Find error:', findError)
    throw _createError({ statusCode: 400, message: '本日の出勤打刻がありません' })
  }

  // 退勤打刻を更新（JST時刻）
  const jstClockOut = getJSTDate()
  console.log('🔍 Recording clock-out at JST:', jstClockOut)

  const { data: updatedClock, error: updateError } = await _supabase
    .from('Clock')
    .update({
      clockOut: jstClockOut
    })
    .eq('id', clock.id)
    .select()
    .single()

  if (updateError) {
    console.log('🔍 Clock-out: Update error:', updateError)
    throw _createError({ statusCode: 500, message: '退勤打刻に失敗しました' })
  }

  return {
    message: '退勤打刻が完了しました',
    clock: updatedClock
  }
}

export default defineEventHandler(clockOutHandler) 