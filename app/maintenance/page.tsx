'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tools, Clock, Mail } from 'lucide-react'

export default function MaintenancePage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="glass p-8 rounded-2xl">
          {/* Icon */}
          <div className="w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Tools className="w-8 h-8 text-nature-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Under Maintenance
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {settings?.maintenanceMessage || 
             "We're currently performing scheduled maintenance to improve our service. We'll be back shortly!"}
          </p>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Temporary downtime for improvements</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>Contact support if needed</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-3 bg-nature-600 text-white rounded-xl hover:bg-nature-700 transition-colors"
            >
              Check Again
            </button>
            <a
              href="mailto:support@imagehost.com"
              className="block w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-center"
            >
              Contact Support
            </a>
          </div>

          {/* Admin Access */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Are you an administrator?{' '}
              <a href="/auth/signin" className="text-nature-600 hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Animation */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-nature-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-nature-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-nature-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </motion.div>
    </div>
  )
}
