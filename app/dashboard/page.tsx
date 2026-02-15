'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Upload,
  Image as ImageIcon,
  Grid,
  List,
  Search,
  Star,
  Trash2,
  Crown,
  LogOut,
  Settings,
  HardDrive,
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Image {
  id: string
  filename: string
  originalName: string
  url: string
  thumbnailUrl: string
  size: number
  isFavorite: boolean
  createdAt: string
}

interface UserData {
  name: string
  email: string
  storageUsed: number
  storageLimit: number
  imageCount: number
  isPremium: boolean
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [images, setImages] = useState<Image[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    try {
      const [imagesRes, userRes] = await Promise.all([
        fetch('/api/images'),
        fetch('/api/user'),
      ])

      if (imagesRes.ok) {
        const imagesData = await imagesRes.json()
        setImages(imagesData)
      }

      if (userRes.ok) {
        const userData = await userRes.json()
        setUserData(userData)
      }
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const deleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id))
        toast.success('Image deleted')
        fetchData()
      } else {
        toast.error('Failed to delete image')
      }
    } catch (error) {
      toast.error('Failed to delete image')
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/images/${id}/favorite`, {
        method: 'PATCH',
      })

      if (response.ok) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
          )
        )
      }
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const filteredImages = images.filter((img) =>
    img.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen gradient-animated flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  const storagePercentage = userData
    ? (userData.storageUsed / userData.storageLimit) * 100
    : 0

  return (
    <div className="min-h-screen gradient-animated">
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gradient">
              ImageHost
            </Link>
            <div className="flex items-center gap-4">
              {session?.user.role === 'ADMIN' && (
                <Link href="/admin">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all">
                    Admin Panel
                  </button>
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 hover:bg-white/50 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-2">
              <ImageIcon className="w-8 h-8 text-nature-600" />
              {userData?.isPremium && <Crown className="w-6 h-6 text-yellow-500" />}
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {userData?.imageCount || 0}
            </div>
            <div className="text-sm text-gray-600">Total Images</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-2xl"
          >
            <HardDrive className="w-8 h-8 text-nature-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {((userData?.storageUsed || 0) / 1024 / 1024).toFixed(1)} MB
            </div>
            <div className="text-sm text-gray-600">Storage Used</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-nature-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-2xl md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {userData?.isPremium ? 'Premium Account' : 'Free Account'}
                </div>
                <div className="text-sm text-gray-600">
                  {userData?.isPremium
                    ? 'Enjoying premium benefits'
                    : 'Upgrade for more storage and features'}
                </div>
              </div>
              {!userData?.isPremium && (
                <Link href="/pricing">
                  <button className="px-6 py-3 bg-gradient-to-r from-nature-600 to-nature-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    Upgrade
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        <div className="glass p-6 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-nature-600 text-white'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-nature-600 text-white'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <Link href="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-nature-600 text-white rounded-xl font-semibold hover:bg-nature-700 transition-all shadow-lg flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload
              </motion.button>
            </Link>
          </div>
        </div>

        {filteredImages.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No images yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start uploading images to see them here
            </p>
            <Link href="/upload">
              <button className="px-6 py-3 bg-nature-600 text-white rounded-xl font-semibold hover:bg-nature-700 transition-all">
                Upload Your First Image
              </button>
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-4'
            }
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`glass rounded-2xl overflow-hidden group ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                }`}
              >
                <img
                  src={image.thumbnailUrl}
                  alt={image.originalName}
                  className={`object-cover ${
                    viewMode === 'grid'
                      ? 'w-full h-48 rounded-xl mb-3'
                      : 'w-24 h-24 rounded-xl mr-4'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {image.originalName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {(Number(image.size) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(image.id)}
                      className={`p-2 rounded-lg transition-all ${
                        image.isFavorite
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    >
                      <Star
                        className="w-4 h-4"
                        fill={image.isFavorite ? 'currentColor' : 'none'}
                      />
                    </button>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="p-2 bg-white/50 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
