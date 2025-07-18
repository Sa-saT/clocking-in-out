import { createError as h3CreateError, readBody as h3ReadBody, defineEventHandler } from 'h3'
import prisma from '@/lib/prisma'

export async function clockOutHandler(event: any, opts?: { readBodyImpl?: typeof h3ReadBody, prismaImpl?: typeof prisma, createErrorImpl?: typeof h3CreateError }) {
  const _readBody = opts?.readBodyImpl || h3ReadBody
  const _prisma = opts?.prismaImpl || prisma
  const _createError = opts?.createErrorImpl || h3CreateError
  const body = await _readBody(event)
  const { userId } = body as { userId: number }
  if (!userId) {
    throw _createError({ statusCode: 400, message: 'userIdは必須です' })
  }

  // 本日未退勤の出勤レコードを取得
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const clock = await _prisma.clock.findFirst({
    where: {
      userId,
      clockIn: { gte: today },
      clockOut: null,
    },
    orderBy: { clockIn: 'desc' },
  })
  if (!clock) {
    throw _createError({ statusCode: 400, message: '本日の出勤打刻がありません' })
  }

  // 退勤打刻
  const updated = await _prisma.clock.update({
    where: { id: clock.id },
    data: { clockOut: new Date() },
  })
  return { success: true, clock: updated }
}

export default defineEventHandler(clockOutHandler) 