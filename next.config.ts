import type { NextConfig } from 'next'

// Static export: `next build` writes plain files to out/, which GitHub Pages
// serves as-is (see .github/workflows/deploy.yml).
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // The dev badge sits over the guide panel; the terminal shows the same information.
  devIndicators: false,
}

export default nextConfig
