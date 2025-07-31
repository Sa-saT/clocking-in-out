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

export async function clockInHandler(event: any, opts?: {
  supabaseImpl?: typeof supabase,
  createErrorImpl?: (obj: any) => Error,
  readBodyImpl?: (event: any) => Promise<any>
}) {
  const _supabase = opts?.supabaseImpl || supabase
  const _createError = opts?.createErrorImpl || ((obj: any) => { throw new Error(obj.message) })
  const _readBody = opts?.readBodyImpl || (async (event: any) => await readBody(event))

  console.log('🔍 Clock-in API called')
  console.log('🔍 Event context user:', event.context?.user)

  const body = await _readBody(event)
  const { userId } = body as { userId: number }

  if (!userId) {
    throw _createError({ statusCode: 400, message: 'userIdは必須です' })
  }

  // 本日の出勤打刻が既に存在するかチェック（JST基準）
  const jstTodayStart = getJSTTodayStart()
  const jstTomorrowStart = getJSTTomorrowStart()

  console.log('🔍 JST Today Start:', jstTodayStart)
  console.log('🔍 JST Tomorrow Start:', jstTomorrowStart)

  const { data: existingClock, error: checkError } = await _supabase
    .from('Clock')
    .select('*')
    .eq('userId', userId)
    .gte('clockIn', jstTodayStart)
    .lt('clockIn', jstTomorrowStart)
    .single()

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116は結果が見つからない場合
    console.log('🔍 Database check error:', checkError)
    throw _createError({ statusCode: 500, message: 'データベースエラーが発生しました' })
  }

  if (existingClock) {
    console.log('🔍 Existing clock found:', existingClock)
    throw _createError({ statusCode: 400, message: '本日は既に出勤打刻済みです' })
  }

  // 出勤打刻を記録（JST時刻）
  const jstClockIn = getJSTDate()
  console.log('🔍 Recording clock-in at JST:', jstClockIn)

  const { data: clock, error: insertError } = await _supabase
    .from('Clock')
    .insert({
      userId: userId,
      clockIn: jstClockIn
    })
    .select()
    .single()

  if (insertError) {
    console.log('🔍 Insert error:', insertError)
    throw _createError({ statusCode: 500, message: '出勤打刻に失敗しました' })
  }

  return {
    message: '出勤打刻が完了しました',
    clock
  }
}

export default defineEventHandler(clockInHandler) 