import prisma from '@/lib/prisma'
import { requireAdmin } from '@/server/api/auth/jwt'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, message: 'ユーザーIDが不正です' })
  }
  const body = await readBody(event)
  const { name, email } = body as { name?: string; email?: string }
  if (!name || name.length > 50) {
    throw createError({ statusCode: 422, message: '名前は必須・50文字以内です' })
  }
  if (!email || !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email) || email.length > 100) {
    throw createError({ statusCode: 422, message: 'メールアドレス形式が不正です' })
  }
  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { name, email },
    })
    return { success: true, user: updated }
  } catch (e: any) {
    throw createError({ statusCode: 400, message: '更新に失敗しました' })
  }
}) 