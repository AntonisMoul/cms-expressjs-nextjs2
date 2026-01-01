/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'http://api:3001/api/:path*'
          : 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
