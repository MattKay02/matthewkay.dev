import type { NextConfig } from 'next'

// Static export: `next build` writes plain files to out/, which Vercel serves
// as-is (see vercel.json and scripts/vercel-build.sh).
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // The dev badge sits over the guide panel; the terminal shows the same information.
  devIndicators: false,
  // Dev only: lets an iPhone open the dev server over its own Personal Hotspot (always 172.20.10.x).
  allowedDevOrigins: ['172.20.10.*'],
}

export default nextConfig
