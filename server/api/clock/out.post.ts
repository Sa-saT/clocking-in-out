import prisma from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId } = body as { userId: number }
  if (!userId) {
    throw createError({ statusCode: 400, message: 'userIdは必須です' })
  }

  // 本日未退勤の出勤レコードを取得
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const clock = await prisma.clock.findFirst({
    where: {
      userId,
      clockIn: { gte: today },
      clockOut: null,
    },
    orderBy: { clockIn: 'desc' },
  })
  if (!clock) {
    throw createError({ statusCode: 400, message: '本日の出勤打刻がありません' })
  }

  // 退勤打刻
  const updated = await prisma.clock.update({
    where: { id: clock.id },
    data: { clockOut: new Date() },
  })
  return { success: true, clock: updated }
}) 