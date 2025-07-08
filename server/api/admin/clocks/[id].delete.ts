import prisma from '@/lib/prisma'
import { requireAdmin } from '@/server/api/auth/jwt'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, message: '打刻IDが不正です' })
  }
  try {
    await prisma.clock.delete({ where: { id } })
    return { success: true }
  } catch (e: any) {
    throw createError({ statusCode: 400, message: '削除に失敗しました' })
  }
}) 