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
  const today = new Date()
  const jstOffset = 9 * 60
  const utc = today.getTime() + (today.getTimezoneOffset() * 60000)
  const jstToday = new Date(utc + (jstOffset * 60000))
  jstToday.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(jstToday)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data: existingClock, error: checkError } = await _supabase
    .from('Clock')
    .select('*')
    .eq('userId', userId)
    .gte('clockIn', jstToday.toISOString())
    .lt('clockIn', tomorrow.toISOString())
    .single()

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116は結果が見つからない場合
    throw _createError({ statusCode: 500, message: 'データベースエラーが発生しました' })
  }

  if (existingClock) {
    throw _createError({ statusCode: 400, message: '本日は既に出勤打刻済みです' })
  }

  // 出勤打刻を記録（JST時刻）
  const { data: clock, error: insertError } = await _supabase
    .from('Clock')
    .insert({
      userId: userId,
      clockIn: getJSTDate()
    })
    .select()
    .single()

  if (insertError) {
    throw _createError({ statusCode: 500, message: '出勤打刻に失敗しました' })
  }

  return {
    message: '出勤打刻が完了しました',
    clock
  }
}

export default defineEventHandler(clockInHandler) 