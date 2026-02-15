import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { webhook } from '@/lib/webhook'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          theme: 'nature',
          primaryColor: '#22c55e',
          enableAnimations: true,
          maxUploadSizeFree: 5,
          maxUploadSizePremium: 100,
          subscriptionPrice: 3.25,
          freeStorageLimit: BigInt(524288000),
          premiumStorageLimit: BigInt(26843545600),
          homepageTitle: 'Modern Image Hosting',
          homepageSubtitle: 'Fast, secure, and beautiful image hosting',
          enableGoogleAuth: false,
          enableNsfwDetection: false,
          maintenanceMode: false,
        },
      })
    }

    return NextResponse.json({
      id: settings.id,
      theme: settings.theme,
      primaryColor: settings.primaryColor,
      enableAnimations: settings.enableAnimations,
      maxUploadSizeFree: settings.maxUploadSizeFree,
      maxUploadSizePremium: settings.maxUploadSizePremium,
      subscriptionPrice: settings.subscriptionPrice,
      freeStorageLimit: Number(settings.freeStorageLimit),
      premiumStorageLimit: Number(settings.premiumStorageLimit),
      homepageTitle: settings.homepageTitle,
      homepageSubtitle: settings.homepageSubtitle,
      enableGoogleAuth: settings.enableGoogleAuth,
      enableNsfwDetection: settings.enableNsfwDetection,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    const settings = await prisma.siteSettings.upsert({
      where: { id: data.id || 'default' },
      create: {
        theme: data.theme || 'nature',
        primaryColor: data.primaryColor || '#22c55e',
        enableAnimations: data.enableAnimations ?? true,
        maxUploadSizeFree: data.maxUploadSizeFree || 5,
        maxUploadSizePremium: data.maxUploadSizePremium || 100,
        subscriptionPrice: data.subscriptionPrice || 3.25,
        freeStorageLimit: BigInt(data.freeStorageLimit || 524288000),
        premiumStorageLimit: BigInt(data.premiumStorageLimit || 26843545600),
        homepageTitle: data.homepageTitle || 'Modern Image Hosting',
        homepageSubtitle: data.homepageSubtitle || 'Fast, secure, and beautiful image hosting',
        enableGoogleAuth: data.enableGoogleAuth || false,
        enableNsfwDetection: data.enableNsfwDetection || false,
        maintenanceMode: data.maintenanceMode || false,
        maintenanceMessage: data.maintenanceMessage,
      },
      update: {
        theme: data.theme,
        primaryColor: data.primaryColor,
        enableAnimations: data.enableAnimations,
        maxUploadSizeFree: data.maxUploadSizeFree,
        maxUploadSizePremium: data.maxUploadSizePremium,
        subscriptionPrice: data.subscriptionPrice,
        freeStorageLimit: BigInt(data.freeStorageLimit),
        premiumStorageLimit: BigInt(data.premiumStorageLimit),
        homepageTitle: data.homepageTitle,
        homepageSubtitle: data.homepageSubtitle,
        enableGoogleAuth: data.enableGoogleAuth,
        enableNsfwDetection: data.enableNsfwDetection,
        maintenanceMode: data.maintenanceMode,
        maintenanceMessage: data.maintenanceMessage,
      },
    })

    // Send Discord webhook notification for important setting changes
    const changes = []
    if (data.maintenanceMode !== undefined) {
      changes.push(`Maintenance Mode: ${data.maintenanceMode ? 'ENABLED' : 'DISABLED'}`)
    }
    if (data.enableGoogleAuth !== undefined) {
      changes.push(`Google Auth: ${data.enableGoogleAuth ? 'ENABLED' : 'DISABLED'}`)
    }
    if (data.enableNsfwDetection !== undefined) {
      changes.push(`NSFW Detection: ${data.enableNsfwDetection ? 'ENABLED' : 'DISABLED'}`)
    }

    if (changes.length > 0) {
      await webhook.adminAction(
        session.user.id,
        'Settings Updated',
        changes.join(', ')
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
