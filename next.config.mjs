/** @type {import('next').NextConfig} */
const nextConfig = {

    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
    },
  }
  
  export default nextConfig
  