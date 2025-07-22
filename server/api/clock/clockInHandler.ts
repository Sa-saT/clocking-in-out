import { createError, readBody as h3ReadBody } from 'h3'
import prisma from '@/lib/prisma'

export async function clockInHandler(event: any, opts?: { readBodyImpl?: typeof h3ReadBody }) {
  const _readBody = opts?.readBodyImpl || h3ReadBody
  const body = await _readBody(event)
  const { userId } = body as { userId: number }
  if (!userId) {
    throw createError({ statusCode: 400, message: 'userIdは必須です' })
  }

  // 退勤打刻漏れ自動補完: 前日までの未退勤レコードを補完
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  // 前日までの未退勤レコードを23:59:59で補完
  await prisma.clock.updateMany({
    where: {
      userId,
      clockOut: null,
      clockIn: { lt: today },
    },
    data: {
      clockOut: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1), // 前日23:59:59
      note: '打刻漏れ',
    },
  })

  // すでに本日出勤済みかチェック
  const alreadyClockedIn = await prisma.clock.findFirst({
    where: {
      userId,
      clockIn: { gte: today },
      clockOut: null,
    },
  })
  if (alreadyClockedIn) {
    throw createError({ statusCode: 400, message: '本日はすでに出勤打刻済みです' })
  }

  // 出勤打刻
  const clock = await prisma.clock.create({
    data: {
      userId,
      clockIn: new Date(),
    },
  })
  return { success: true, clock }
} 