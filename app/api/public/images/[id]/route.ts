import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Increment view count
    await prisma.image.update({
      where: { id: params.id },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    // Return public image data
    return NextResponse.json({
      id: image.id,
      url: image.url,
      thumbnailUrl: image.thumbnailUrl,
      originalName: image.originalName,
      mimeType: image.mimeType,
      size: Number(image.size),
      width: image.width,
      height: image.height,
      createdAt: image.createdAt,
      views: image.views || 0,
      user: {
        name: image.user.name,
        email: image.user.email,
      },
    })
  } catch (error) {
    console.error('Error fetching public image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}
