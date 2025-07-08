import prisma from '@/lib/prisma'
import { requireAdmin } from '@/server/api/auth/jwt'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, message: '打刻IDが不正です' })
  }
  const body = await readBody(event)
  const { clockIn, clockOut } = body as { clockIn?: string; clockOut?: string }
  if (!clockIn || isNaN(Date.parse(clockIn))) {
    throw createError({ statusCode: 422, message: '出勤時刻が不正です' })
  }
  if (!clockOut || isNaN(Date.parse(clockOut))) {
    throw createError({ statusCode: 422, message: '退勤時刻が不正です' })
  }
  if (new Date(clockIn) >= new Date(clockOut)) {
    throw createError({ statusCode: 422, message: '出勤時刻は退勤時刻より前である必要があります' })
  }
  try {
    const updated = await prisma.clock.update({
      where: { id },
      data: { clockIn: new Date(clockIn), clockOut: new Date(clockOut) },
    })
    return { success: true, clock: updated }
  } catch (e: any) {
    throw createError({ statusCode: 400, message: '更新に失敗しました' })
  }
}) 