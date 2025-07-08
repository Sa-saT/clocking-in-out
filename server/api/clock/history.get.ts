import prisma from '@/lib/prisma'
import { requireAuth } from '../auth/jwt'

export default defineEventHandler(async (event) => {
  // JWT認証
  const auth = requireAuth(event)

  // クエリ取得
  const query = getQuery(event)
  const userId = Number(query.userId)
  if (!userId || isNaN(userId) || userId <= 0) {
    throw createError({ statusCode: 400, message: 'userIdは必須です（正の整数）' })
  }

  // 認証ユーザーIDとuserIdの一致を厳格にチェック
  if (!auth || Number(auth.sub) !== userId) {
    throw createError({ statusCode: 403, message: '他ユーザーの履歴取得はできません' })
  }

  // ページング・日付フィルタ
  const limit = Math.min(Number(query.limit) || 20, 100) // 最大100件まで
  const offset = Number(query.offset) || 0
  const dateFrom = query.dateFrom ? new Date(query.dateFrom as string) : undefined
  const dateTo = query.dateTo ? new Date(query.dateTo as string) : undefined

  // where句構築
  const where: any = { userId }
  if (dateFrom || dateTo) {
    where.clockIn = {}
    if (dateFrom) where.clockIn.gte = dateFrom
    if (dateTo) where.clockIn.lte = dateTo
  }

  // 打刻履歴を取得（降順）
  const clocks = await prisma.clock.findMany({
    where,
    orderBy: { clockIn: 'desc' },
    skip: offset,
    take: limit,
  })

  return { success: true, clocks }
}) 