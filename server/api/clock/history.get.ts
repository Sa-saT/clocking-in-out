import { createError as h3CreateError, defineEventHandler, getQuery as h3GetQuery } from 'h3'
import prisma from '@/lib/prisma'
import { requireAuth as requireAuthDefault } from '../auth/jwt'
import type { JwtPayload } from 'jsonwebtoken'

export async function clockHistoryHandler(event: any, opts?: {
  prismaImpl?: typeof prisma,
  createErrorImpl?: typeof h3CreateError,
  requireAuthImpl?: typeof requireAuthDefault,
  getQueryImpl?: typeof h3GetQuery
}) {
  const _prisma = opts?.prismaImpl || prisma
  const _createError = opts?.createErrorImpl || h3CreateError
  const _requireAuth = opts?.requireAuthImpl || requireAuthDefault
  const _getQuery = opts?.getQueryImpl || h3GetQuery

  // JWT認証
  const auth = _requireAuth(event) as JwtPayload & { email?: string }

  // クエリ取得
  const query = _getQuery(event)
  const userId = Number(query.userId)
  if (!userId || isNaN(userId) || userId <= 0) {
    throw _createError({ statusCode: 400, message: 'userIdは必須です（正の整数）' })
  }

  // 管理者は任意ユーザーの履歴取得を許可
  const isAdmin = auth?.email === 'admin@example.com'
  if (!isAdmin && Number(auth.sub) !== userId) {
    throw _createError({ statusCode: 403, message: '他ユーザーの履歴取得はできません' })
  }

  // ページング・日付フィルタ
  const limit = Math.min(Number(query.limit) || 20, 100)
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
  const clocks = await _prisma.clock.findMany({
    where,
    orderBy: { clockIn: 'desc' },
    skip: offset,
    take: limit,
  })

  return { success: true, clocks }
}

export default defineEventHandler(clockHistoryHandler) 