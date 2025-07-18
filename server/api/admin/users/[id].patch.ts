import { createError as h3CreateError, defineEventHandler, readBody as h3ReadBody } from 'h3'
import prisma from '@/lib/prisma'
import { requireAdmin as requireAdminDefault } from '@/server/api/auth/jwt'

export async function updateUserHandler(event: any, opts?: {
  prismaImpl?: typeof prisma,
  createErrorImpl?: typeof h3CreateError,
  requireAdminImpl?: typeof requireAdminDefault,
  readBodyImpl?: typeof h3ReadBody
}) {
  const _prisma = opts?.prismaImpl || prisma
  const _createError = opts?.createErrorImpl || h3CreateError
  const _requireAdmin = opts?.requireAdminImpl || requireAdminDefault
  const _readBody = opts?.readBodyImpl || h3ReadBody

  _requireAdmin(event)
  const id = Number(event.context.params?.id)
  if (!id) {
    throw _createError({ statusCode: 400, message: 'ユーザーIDが不正です' })
  }
  const body = await _readBody(event)
  const { name, email } = body as { name?: string; email?: string }
  if (!name || name.length > 50) {
    throw _createError({ statusCode: 422, message: '名前は必須・50文字以内です' })
  }
  if (!email || !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email) || email.length > 100) {
    throw _createError({ statusCode: 422, message: 'メールアドレス形式が不正です' })
  }
  try {
    const updated = await _prisma.user.update({
      where: { id },
      data: { name, email },
    })
    return { success: true, user: updated }
  } catch (e: any) {
    throw _createError({ statusCode: 400, message: '更新に失敗しました' })
  }
}

export default defineEventHandler(updateUserHandler) 