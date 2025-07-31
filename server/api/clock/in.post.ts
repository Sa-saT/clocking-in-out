import { readBody, defineEventHandler } from 'h3'
import { supabase } from '@/lib/supabase'

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

  // 本日の出勤打刻が既に存在するかチェック
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data: existingClock, error: checkError } = await _supabase
    .from('Clock')
    .select('*')
    .eq('userId', userId)
    .gte('clockIn', today.toISOString())
    .lt('clockIn', tomorrow.toISOString())
    .single()

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116は結果が見つからない場合
    throw _createError({ statusCode: 500, message: 'データベースエラーが発生しました' })
  }

  if (existingClock) {
    throw _createError({ statusCode: 400, message: '本日は既に出勤打刻済みです' })
  }

  // 出勤打刻を記録
const { data: clock, error: insertError } = await _supabase
    .from('Clock')
    .insert({
      userId: userId,
      clockIn: new Date().toISOString()
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