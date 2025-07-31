import { readBody, defineEventHandler } from 'h3'
import { supabase } from '@/lib/supabase'

export async function updateUserHandler(event: any, opts?: {
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

  const userId = parseInt(event.context.params?.id)
  if (!userId || isNaN(userId)) {
    throw _createError({ statusCode: 400, message: 'ユーザーIDが不正です' })
  }

  const body = await _readBody(event)
  const { name, email } = body as { name?: string; email?: string }

  // バリデーション
  if (name !== undefined && (!name || name.length > 50)) {
    throw _createError({ statusCode: 400, message: '名前は必須・50文字以内です' })
  }

  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw _createError({ statusCode: 400, message: 'メールアドレス形式が不正です' })
  }

  // 更新データの構築
  const updateData: any = {}
  if (name !== undefined) updateData.name = name
  if (email !== undefined) updateData.email = email

  if (Object.keys(updateData).length === 0) {
    throw _createError({ statusCode: 400, message: '更新するデータがありません' })
  }

  // ユーザー更新
  const { data: updatedUser, error } = await _supabase
    .from('User')
    .update(updateData)
    .eq('id', userId)
    .select('id, email, name')
    .single()

  if (error) {
    throw _createError({ statusCode: 500, message: '更新に失敗しました' })
  }

  return {
    message: 'ユーザー情報を更新しました',
    user: updatedUser
  }
}

export default defineEventHandler(updateUserHandler) 