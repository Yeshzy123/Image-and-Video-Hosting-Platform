import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const image = await prisma.image.findUnique({
      where: { id: params.id },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    if (image.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedImage = await prisma.image.update({
      where: { id: params.id },
      data: {
        isFavorite: !image.isFavorite,
      },
    })

    return NextResponse.json({ isFavorite: updatedImage.isFavorite })
  } catch (error) {
    console.error('Error updating favorite:', error)
    return NextResponse.json(
      { error: 'Failed to update favorite' },
      { status: 500 }
    )
  }
}
