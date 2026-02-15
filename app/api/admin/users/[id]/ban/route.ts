import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { webhook } from '@/lib/webhook'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ban } = await req.json()

    const user = await prisma.user.findUnique({ where: { id: params.id } })
    
    await prisma.user.update({
      where: { id: params.id },
      data: { isBanned: ban },
    })

    // Send Discord webhook notification
    if (ban && user) {
      await webhook.userBanned(user.id, session.user.id, 'Banned by admin')
    } else if (!ban && user) {
      await webhook.adminAction(session.user.id, 'Unban User', `User ${user.email} has been unbanned`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user ban status:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
