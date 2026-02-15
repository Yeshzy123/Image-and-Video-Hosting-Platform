'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Download, Upload, X, Share2, ImageIcon, Video, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface UploadedImage {
  id: string
  url: string
  thumbnailUrl: string
  deleteToken: string
  originalName: string
  mimeType: string
}

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastUploadedImage, setLastUploadedImage] = useState<UploadedImage | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const acceptTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'video/*': ['.mp4', '.mov', '.avi', '.webm'],
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptTypes,
    multiple: true,
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    setUploading(true)
    const uploaded: UploadedImage[] = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          toast.error(errorData.error || 'Upload failed')
          return
        }

        const result = await response.json()
        
        setUploadedImages(prev => [...prev, result])
        setLastUploadedImage(result)
        setShowSuccessModal(true)
        setFiles([])
        toast.success('Image uploaded successfully!')
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen gradient-animated flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen gradient-animated py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Upload Images</h1>
          <Link href="/dashboard">
            <button className="px-4 py-2 glass rounded-xl hover:bg-white/90 transition-all">
              Back to Dashboard
            </button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-3xl mb-8"
        >
          <div
            {...getRootProps()}
            className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-nature-600 bg-nature-50'
                : 'border-gray-300 hover:border-nature-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 mx-auto mb-4 text-nature-600" />
            <p className="text-xl font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-gray-600">or click to browse</p>
            <p className="text-sm text-gray-500 mt-4">
              Supports: PNG, JPG, JPEG, GIF, WEBP
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between bg-white/50 p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      {file.type.startsWith('video/') ? (
                        <Video className="w-5 h-5 text-nature-600" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-nature-600" />
                      )}
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-6 py-4 bg-nature-600 text-white rounded-xl font-semibold hover:bg-nature-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {uploading ? 'Uploading...' : `Upload ${files.length} Image${files.length > 1 ? 's' : ''}`}
              </motion.button>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {uploadedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass p-8 rounded-3xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                Upload Complete!
              </h2>

              <div className="space-y-6">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="bg-white/50 p-6 rounded-2xl">
                    <img
                      src={image.thumbnailUrl}
                      alt="Uploaded"
                      className="w-32 h-32 object-cover rounded-xl mb-4"
                    />

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shareable Link
                        </label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={`${window.location.origin}/view/${image.id}`}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${window.location.origin}/view/${image.id}`,
                                'Shareable link'
                              )
                            }
                            className="px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Direct Link
                        </label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={`${window.location.origin}${image.url}`}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${window.location.origin}${image.url}`,
                                'Direct link'
                              )
                            }
                            className="px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Thumbnail Link
                        </label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={`${window.location.origin}${image.thumbnailUrl}`}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${window.location.origin}${image.thumbnailUrl}`,
                                'Thumbnail link'
                              )
                            }
                            className="px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Delete Token
                        </label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={image.deleteToken}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={() =>
                              copyToClipboard(image.deleteToken, 'Delete token')
                            }
                            className="px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && lastUploadedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowSuccessModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Upload Successful!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your {lastUploadedImage.originalName.split('.').pop()?.toUpperCase()} has been uploaded successfully.
                  </p>
                  
                  {/* Preview */}
                  <div className="mb-4">
                    {lastUploadedImage.mimeType.startsWith('video/') ? (
                      <video
                        src={lastUploadedImage.url}
                        className="w-full max-h-48 object-cover rounded-lg"
                        controls
                        poster={lastUploadedImage.thumbnailUrl || undefined}
                      />
                    ) : (
                      <img
                        src={lastUploadedImage.thumbnailUrl || lastUploadedImage.url}
                        alt={lastUploadedImage.originalName}
                        className="w-full max-h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  {/* Shareable Links */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shareable Link
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={`${window.location.origin}/view/${lastUploadedImage.id}`}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(`${window.location.origin}/view/${lastUploadedImage.id}`)
                          }
                          className="px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Direct Link
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={lastUploadedImage.url}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(lastUploadedImage.url)}
                          className="px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="flex-1 px-4 py-3 bg-nature-600 text-white rounded-xl hover:bg-nature-700 transition-colors"
                    >
                      Upload More
                    </button>
                    <button
                      onClick={() => {
                        setShowSuccessModal(false)
                        router.push('/dashboard')
                      }}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      View Gallery
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
