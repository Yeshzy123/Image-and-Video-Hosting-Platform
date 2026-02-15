import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { saveImage, optimizeImage } from '@/lib/storage'
import { generateDeleteToken, getMaxFileSize } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'Account banned' }, { status: 403 })
    }

    const isPremium = user.subscription?.status === 'ACTIVE'
    const maxFileSize = getMaxFileSize(isPremium)

    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          error: `File too large. Max size: ${maxFileSize / 1024 / 1024}MB`,
        },
        { status: 400 }
      )
    }

    const allowedTypes = [
      'image/png', 
      'image/jpeg', 
      'image/jpg', 
      'image/gif', 
      'image/webp',
      'video/mp4', 
      'video/mov', 
      'video/avi', 
      'video/webm'
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Allowed types: PNG, JPG, GIF, WebP, MP4, MOV, AVI, WebM',
        },
        { status: 400 }
      )
    }

    const newStorageUsed = Number(user.storageUsed) + file.size
    if (newStorageUsed > Number(user.storageLimit)) {
      return NextResponse.json(
        { error: 'Storage limit exceeded' },
        { status: 400 }
      )
    }

    console.log('Upload processing file:', file.name, file.type, file.size)

    const buffer = Buffer.from(await file.arrayBuffer())
    const optimizedBuffer = await optimizeImage(buffer, file.type)

    console.log('File optimized, saving...')

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}_${randomString}.${extension}`

    const result = await saveImage(buffer, filename, file.type)

    console.log('File saved:', result)

    const image = await prisma.image.create({
      data: {
        userId: user.id,
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: BigInt(file.size),
        width: result.width,
        height: result.height,
        duration: result.duration,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        deleteToken: generateDeleteToken(),
      },
    })

    await prisma.user.update({
      where: { id: user.id },
      data: {
        storageUsed: BigInt(newStorageUsed),
      },
    })

    return NextResponse.json({
      id: image.id,
      url: image.url,
      thumbnailUrl: image.thumbnailUrl,
      deleteToken: image.deleteToken,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
      { status: 500 }
    )
  }
}
