import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const storageType = process.env.STORAGE_TYPE || 'local'
const uploadDir = process.env.UPLOAD_DIR || './public/uploads'

const s3Client = storageType === 's3' ? new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
}) : null

export async function saveImage(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<{ url: string; thumbnailUrl: string | null; width: number; height: number; duration: number | null }> {
  let width = 0
  let height = 0
  let duration = null
  let thumbnail: Buffer | null = null
  let thumbnailUrl: string | null = null

  if (mimeType.startsWith('image/')) {
    const metadata = await sharp(buffer).metadata()
    width = metadata.width || 0
    height = metadata.height || 0

    thumbnail = await sharp(buffer)
      .resize(300, 300, { fit: 'inside' })
      .toBuffer()
  } else if (mimeType.startsWith('video/')) {
    // For videos, we'll save the original file and create a thumbnail later
    // For now, just set basic dimensions
    width = 1280  // Default video dimensions
    height = 720
    duration = 0  // Would need ffmpeg to get actual duration
    thumbnail = null
  }

  const thumbnailFilename = `thumb_${filename}`

  if (storageType === 's3' && s3Client) {
    const bucket = process.env.AWS_S3_BUCKET || ''

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        Body: buffer,
        ContentType: mimeType,
      })
    )

    if (thumbnail) {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: thumbnailFilename,
          Body: thumbnail,
          ContentType: mimeType,
        })
      )
      thumbnailUrl = `https://${bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${thumbnailFilename}`
    }
  } else {
    await fs.mkdir(uploadDir, { recursive: true })
    await fs.writeFile(path.join(uploadDir, filename), buffer)

    if (thumbnail) {
      await fs.writeFile(path.join(uploadDir, thumbnailFilename), thumbnail)
      thumbnailUrl = `/${uploadDir.replace('./public/', '')}/${thumbnailFilename}`
    }
  }

  const url = storageType === 's3'
    ? `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${filename}`
    : `/${uploadDir.replace('./public/', '')}/${filename}`

  return {
    url,
    thumbnailUrl,
    width,
    height,
    duration,
  }
}

export async function deleteImage(filename: string): Promise<void> {
  const thumbnailFilename = `thumb_${filename}`

  if (storageType === 's3' && s3Client) {
    const bucket = process.env.AWS_S3_BUCKET || ''

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: filename,
      })
    )

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: thumbnailFilename,
      })
    )
  } else {
    const filePath = path.join(uploadDir, filename)
    const thumbnailPath = path.join(uploadDir, thumbnailFilename)

    try {
      await fs.unlink(filePath)
      await fs.unlink(thumbnailPath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }
}

export async function optimizeImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  // Don't optimize videos, return as-is
  if (mimeType.startsWith('video/')) {
    return buffer
  }

  let sharpInstance = sharp(buffer)

  if (mimeType === 'image/png') {
    sharpInstance = sharpInstance.png({ quality: 90, compressionLevel: 9 })
  } else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    sharpInstance = sharpInstance.jpeg({ quality: 85, progressive: true })
  } else if (mimeType === 'image/webp') {
    sharpInstance = sharpInstance.webp({ quality: 85 })
  }

  return await sharpInstance.toBuffer()
}
