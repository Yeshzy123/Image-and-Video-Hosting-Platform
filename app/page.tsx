'use client'

import { motion } from 'framer-motion'
import { Upload, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-50 to-pink-50">
      <nav className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-nature-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-nature-600" />
              <span className="text-2xl font-bold text-gradient">ImageVault</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-700 hover:text-nature-600 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-gradient">Fast & Secure</span>
                <br />
                Image Hosting
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Upload, share, and manage your images and videos with our modern hosting platform. 
                Built for speed, security, and simplicity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/upload" className="px-8 py-4 bg-nature-600 text-white rounded-xl hover:bg-nature-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Start Uploading</span>
                </Link>
                <Link href="/pricing" className="px-8 py-4 bg-white text-nature-600 border-2 border-nature-600 rounded-xl hover:bg-nature-50 transition-all flex items-center justify-center space-x-2">
                  <span>View Pricing</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-nature-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-nature-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Optimized CDN delivery ensures your images load instantly around the world.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-nature-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-nature-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Your files are encrypted and stored safely with automatic backups.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-nature-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-nature-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Sharing</h3>
              <p className="text-gray-600">
                Share your images with custom links, social media integration, and more.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
