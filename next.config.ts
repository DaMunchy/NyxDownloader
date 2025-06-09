import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Ini mematikan ESLint waktu build (misal di Vercel)
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
