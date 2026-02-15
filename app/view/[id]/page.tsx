'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Download, Share2, Eye, Calendar, User } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ImageViewerPage() {
  const params = useParams()
  const router = useRouter()
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)

  useEffect(() => {
    fetchImage()
  }, [params.id])

  const fetchImage = async () => {
    try {
      const res = await fetch(`/api/public/images/${params.id}`)
      
      if (!res.ok) {
        if (res.status === 404) {
          router.push('/404')
        }
        return
      }

      const data = await res.json()
      setImage(data)
    } catch (error) {
      console.error('Error fetching image:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    setShowSignupPrompt(true)
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/view/${params.id}`
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: image?.originalName || 'Shared Image',
          text: 'Check out this image!',
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nature-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading image...</p>
        </div>
      </div>
    )
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nature-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Image Not Found</h1>
          <p className="text-gray-600 mb-6">This image may have been deleted or the link is invalid.</p>
          <Link href="/" className="px-6 py-3 bg-nature-600 text-white rounded-xl hover:bg-nature-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-50 to-pink-50">
      {/* Header */}
      <header className="glass border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-nature-600 to-pink-600 bg-clip-text text-transparent">
              ImageHost
            </Link>
            <Link href="/auth/signin" className="px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Image Display */}
          <div className="lg:col-span-2">
            <div className="glass p-6 rounded-2xl">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {image.mimeType.startsWith('video/') ? (
                  <video
                    src={image.url}
                    controls
                    className="w-full h-full object-contain"
                    poster={image.thumbnailUrl}
                  />
                ) : (
                  <img
                    src={image.url}
                    alt={image.originalName}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-nature-600 text-white rounded-xl hover:bg-nature-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Image Info */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Image Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Uploaded by</p>
                    <p className="font-semibold">{image.user.name || 'Anonymous'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Uploaded on</p>
                    <p className="font-semibold">{new Date(image.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="font-semibold">{image.views || 0}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">File name</p>
                  <p className="font-semibold truncate">{image.originalName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">File size</p>
                  <p className="font-semibold">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="font-semibold">{image.mimeType}</p>
                </div>
              </div>

              {/* Upload Your Own CTA */}
              <div className="mt-6 p-4 bg-nature-50 rounded-xl">
                <h3 className="font-semibold text-nature-900 mb-2">Want to share your images?</h3>
                <p className="text-sm text-nature-700 mb-4">
                  Join ImageHost to upload, share, and manage your images with advanced features.
                </p>
                <Link href="/auth/signup" className="block w-full text-center px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors">
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Sign-up Prompt Modal */}
      {showSignupPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Sign Up to Download</h3>
            <p className="text-gray-600 mb-6">
              Create a free account to download this image and unlock all features.
            </p>
            <div className="flex gap-4">
              <Link
                href="/auth/signup"
                className="flex-1 text-center px-4 py-3 bg-nature-600 text-white rounded-xl hover:bg-nature-700 transition-colors"
              >
                Sign Up
              </Link>
              <button
                onClick={() => setShowSignupPrompt(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
