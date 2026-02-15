'use client'

import { motion } from 'framer-motion'
import { Upload, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen gradient-animated">
      <nav className="glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-nature-600" />
              <span className="text-2xl font-bold text-gradient">ImageHost</span>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <button className="px-4 py-2 text-nature-700 hover:text-nature-900 font-medium transition-colors">
                      Dashboard
                    </button>
                  </Link>
                  <Link href="/upload">
                    <button className="px-6 py-2 bg-nature-600 text-white rounded-full hover:bg-nature-700 transition-all transform hover:scale-105 shadow-lg">
                      Upload
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <button className="px-4 py-2 text-nature-700 hover:text-nature-900 font-medium transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="px-6 py-2 bg-nature-600 text-white rounded-full hover:bg-nature-700 transition-all transform hover:scale-105 shadow-lg">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gray-900">
              Modern Image Hosting
              <br />
              <span className="text-gradient">Made Beautiful</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Fast, secure, and stunning image hosting with premium features.
              Upload, share, and manage your images effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-nature-600 text-white rounded-full text-lg font-semibold hover:bg-nature-700 transition-all shadow-2xl flex items-center gap-2 justify-center"
                >
                  Start Free <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 glass text-nature-700 rounded-full text-lg font-semibold hover:bg-white/90 transition-all"
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Upload,
                title: 'Easy Upload',
                description: 'Drag and drop multiple images at once. Automatic optimization and compression.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Instant uploads with CDN delivery. Your images load in milliseconds.',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Enterprise-grade security. Control who sees your images with privacy settings.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass p-8 rounded-3xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <feature.icon className="w-12 h-12 text-nature-600 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass p-12 rounded-3xl text-center"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Premium for just <span className="text-gradient">$3.25/month</span>
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              Unlock 25GB+ storage, larger uploads, and priority processing
            </p>
            <Link href="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-nature-600 to-nature-500 text-white rounded-full text-lg font-semibold shadow-2xl"
              >
                Upgrade Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="glass py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-700">
          <p>&copy; 2024 ImageHost. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
