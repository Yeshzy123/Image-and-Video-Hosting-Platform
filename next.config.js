/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fixed for Netlify - no static export
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig
