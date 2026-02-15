'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error('Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-animated">
      <nav className="glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-nature-600" />
              <span className="text-2xl font-bold text-gradient">ImageHost</span>
            </Link>
            <div className="flex items-center space-x-4">
              {session ? (
                <Link href="/dashboard">
                  <button className="px-4 py-2 text-nature-700 hover:text-nature-900 font-medium transition-colors">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <button className="px-4 py-2 text-nature-700 hover:text-nature-900 font-medium transition-colors">
                    Sign In
                  </button>
                </Link>
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
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Choose the plan that's right for you. Upgrade or downgrade at any time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-3xl"
            >
              <div className="mb-6">
                <Zap className="w-12 h-12 text-nature-600 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Free</h2>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  $0<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  '500 MB storage',
                  'Up to 5 MB per file',
                  'Basic features',
                  'Community support',
                  'Public image hosting',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-nature-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/signup">
                <button className="w-full py-3 bg-white border-2 border-nature-600 text-nature-700 rounded-xl font-semibold hover:bg-nature-50 transition-all">
                  Get Started Free
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-8 rounded-3xl border-4 border-nature-600 relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-nature-600 to-nature-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  MOST POPULAR
                </span>
              </div>

              <div className="mb-6">
                <Crown className="w-12 h-12 text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Premium</h2>
                <div className="text-4xl font-bold text-gradient mb-4">
                  $3.25<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">For power users and professionals</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  '25 GB+ storage',
                  'Up to 100 MB per file',
                  'Priority processing',
                  'Faster uploads',
                  'No ads',
                  'Custom image links',
                  'Advanced analytics',
                  'Priority support',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-nature-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-nature-600 to-nature-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Upgrade to Premium'}
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes! You can cancel your subscription at any time. Your account will revert to the free plan.',
                },
                {
                  q: 'What happens to my images if I downgrade?',
                  a: 'All your images remain safe. You just won\'t be able to upload new ones until you\'re under the free tier limit.',
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'We offer a 30-day money-back guarantee. Contact support if you\'re not satisfied.',
                },
              ].map((faq, index) => (
                <div key={index} className="glass p-6 rounded-2xl text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
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
