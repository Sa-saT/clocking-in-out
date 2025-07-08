import prisma from '@/lib/prisma'
import { requireAdmin } from '@/server/api/auth/jwt'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
    orderBy: { id: 'asc' },
  })
  return { users }
}) 