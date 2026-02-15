'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users,
  Image as ImageIcon,
  DollarSign,
  HardDrive,
  TrendingUp,
  Shield,
  Ban,
  Trash2,
  Crown,
  Settings,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface AdminStats {
  totalUsers: number
  totalImages: number
  totalStorage: number
  activeSubscriptions: number
  monthlyRevenue: number
  newUsersToday: number
}

interface User {
  id: string
  name: string
  email: string
  role: string
  isBanned: boolean
  storageUsed: number
  imageCount: number
  isPremium: boolean
  createdAt: string
}

import AdminGuard from '@/components/AdminGuard'

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  )
}

function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'images' | 'settings'>('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, settingsRes, imagesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/images'),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users)
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
      }

      if (imagesRes.ok) {
        const imagesData = await imagesRes.json()
        setImages(imagesData.images)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const toggleBanUser = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBanned: !currentStatus }),
      })

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isBanned: !currentStatus } : user
          )
        )
        toast.success(`User ${!currentStatus ? 'banned' : 'unbanned'} successfully`)
      }
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const updateSetting = async (key: string, value: any) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, [key]: value }),
      })

      if (response.ok) {
        setSettings((prev) => ({ ...prev, [key]: value }))
        toast.success('Setting updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update setting')
    }
  }

  const flagImage = async (imageId: string, isFlagged: boolean) => {
    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isFlagged ? 'flag' : 'unflag', reason: 'Admin moderation' }),
      })

      if (response.ok) {
        setImages(prev =>
          prev.map(img =>
            img.id === imageId ? { ...img, isFlagged } : img
          )
        )
        toast.success(`Image ${isFlagged ? 'flagged' : 'unflagged'} successfully`)
      }
    } catch (error) {
      toast.error('Failed to update image')
    }
  }

  const deleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setImages(prev => prev.filter(img => img.id !== imageId))
        toast.success('Image deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete image')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId))
        toast.success('User deleted')
        fetchData()
      } else {
        toast.error('Failed to delete user')
      }
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen gradient-animated flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-animated">
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl hover:bg-white/90 transition-all">
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'images', label: 'Images', icon: ImageIcon },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'glass hover:bg-white/90'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-2xl"
              >
                <Users className="w-8 h-8 text-purple-600 mb-2" />
                <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
                <div className="text-xs text-green-600 mt-1">
                  +{stats.newUsersToday} today
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-6 rounded-2xl"
              >
                <ImageIcon className="w-8 h-8 text-purple-600 mb-2" />
                <div className="text-3xl font-bold text-gray-900">{stats.totalImages}</div>
                <div className="text-sm text-gray-600">Total Images</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 rounded-2xl"
              >
                <HardDrive className="w-8 h-8 text-purple-600 mb-2" />
                <div className="text-3xl font-bold text-gray-900">
                  {(stats.totalStorage / 1024 / 1024 / 1024).toFixed(2)} GB
                </div>
                <div className="text-sm text-gray-600">Total Storage</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-6 rounded-2xl"
              >
                <Crown className="w-8 h-8 text-yellow-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900">
                  {stats.activeSubscriptions}
                </div>
                <div className="text-sm text-gray-600">Active Subscriptions</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass p-6 rounded-2xl md:col-span-2"
              >
                <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-3xl font-bold text-gray-900">
                  ${stats.monthlyRevenue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Images</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Storage</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-white/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {user.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.imageCount}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {(user.storageUsed / 1024 / 1024).toFixed(1)} MB
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            user.isBanned
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleBanUser(user.id, user.isBanned)}
                            className={`p-2 rounded-lg transition-all ${
                              user.isBanned
                                ? 'bg-green-100 hover:bg-green-200 text-green-700'
                                : 'bg-red-100 hover:bg-red-200 text-red-700'
                            }`}
                            title={user.isBanned ? 'Unban user' : 'Ban user'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Image Moderation</h2>
            <div className="mb-4 flex gap-4">
              <select className="px-4 py-2 bg-white/50 border border-gray-300 rounded-xl">
                <option>All Images</option>
                <option>Flagged Only</option>
              </select>
              <input
                type="text"
                placeholder="Search by user..."
                className="px-4 py-2 bg-white/50 border border-gray-300 rounded-xl flex-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No images uploaded yet</p>
                </div>
              ) : (
                images.map((image) => (
                  <div key={image.id} className="bg-white/50 p-4 rounded-xl">
                    {image.mimeType.startsWith('video/') ? (
                      <video
                        src={image.url}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        poster={image.thumbnailUrl}
                      />
                    ) : (
                      <img
                        src={image.thumbnailUrl || image.url}
                        alt={image.originalName}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <div className="text-sm">
                      <div className="font-semibold truncate">{image.originalName}</div>
                      <div className="text-gray-600">{image.user?.email || 'Unknown'}</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs">{(Number(image.size) / 1024 / 1024).toFixed(2)} MB</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => flagImage(image.id, !image.isFlagged)}
                            className={`p-1 rounded ${image.isFlagged ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                          >
                            ⚠️
                          </button>
                          <button
                            onClick={() => deleteImage(image.id)}
                            className="p-1 bg-red-100 hover:bg-red-200 rounded"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {images.length > 0 && (
              <div className="mt-6 flex justify-center">
                <button className="px-6 py-2 bg-nature-600 text-white rounded-xl hover:bg-nature-700">
                  Load More
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-xl">
                        <option value="nature">Nature Green</option>
                        <option value="pastel">Pastel Modern</option>
                        <option value="pink">Light Pink</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value="#22c55e"
                          className="w-12 h-10 bg-white/50 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value="#22c55e"
                          className="flex-1 px-4 py-2 bg-white/50 border border-gray-300 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable Animations</span>
                      <button className="w-12 h-6 bg-nature-600 rounded-full relative">
                        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Upload Limits</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Free Max File Size (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue="5"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Premium Max File Size (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subscription Price ($/month)
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        defaultValue="3.25"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Storage Limits</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Free Storage (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue="500"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Premium Storage (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue="25600"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable Google Auth</span>
                      <button
                        onClick={() => updateSetting('enableGoogleAuth', !settings?.enableGoogleAuth)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          settings?.enableGoogleAuth ? 'bg-nature-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings?.enableGoogleAuth ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable NSFW Detection</span>
                      <button
                        onClick={() => updateSetting('enableNsfwDetection', !settings?.enableNsfwDetection)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          settings?.enableNsfwDetection ? 'bg-nature-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings?.enableNsfwDetection ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                      <button
                        onClick={() => updateSetting('maintenanceMode', !settings?.maintenanceMode)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          settings?.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings?.maintenanceMode ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Homepage</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Homepage Title
                    </label>
                    <input
                      type="text"
                      defaultValue="Modern Image Hosting"
                      className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Homepage Subtitle
                    </label>
                    <input
                      type="text"
                      defaultValue="Fast, secure, and beautiful image hosting"
                      className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">
                  Reset to Defaults
                </button>
                <button className="px-6 py-3 bg-nature-600 text-white rounded-xl hover:bg-nature-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
