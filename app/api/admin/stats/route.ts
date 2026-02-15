import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    const [
      totalUsers,
      totalImages,
      activeSubscriptions,
      newUsersToday,
      storageData,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.image.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.user.aggregate({
        _sum: {
          storageUsed: true,
        },
      }),
    ])

    const totalStorage = Number(storageData._sum.storageUsed || 0)
    const monthlyRevenue = activeSubscriptions * 3.25

    return NextResponse.json({
      totalUsers,
      totalImages,
      totalStorage,
      activeSubscriptions,
      monthlyRevenue,
      newUsersToday,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
