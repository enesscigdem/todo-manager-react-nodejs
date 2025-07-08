// next.config.js
const dev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: dev
            ? 'http://localhost:3001/api/:path*'
            : '/api/:path*'
      }
    ]
  }
}

export default nextConfig;
