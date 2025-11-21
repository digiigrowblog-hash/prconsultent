/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add this if you're using static exports
  output: 'standalone',
  // If you're using API routes, add this:
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig;