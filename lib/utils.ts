import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function generateDeleteToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function getStorageLimit(isPremium: boolean) {
  const freeLimitMB = parseInt(process.env.FREE_STORAGE_LIMIT_MB || '500')
  const premiumLimitMB = parseInt(process.env.PREMIUM_STORAGE_LIMIT_MB || '25600')
  
  return isPremium ? premiumLimitMB * 1024 * 1024 : freeLimitMB * 1024 * 1024
}

export function getMaxFileSize(isPremium: boolean) {
  const freeMaxMB = parseInt(process.env.FREE_MAX_FILE_SIZE_MB || '5')
  const premiumMaxMB = parseInt(process.env.PREMIUM_MAX_FILE_SIZE_MB || '100')
  
  return isPremium ? premiumMaxMB * 1024 * 1024 : freeMaxMB * 1024 * 1024
}
