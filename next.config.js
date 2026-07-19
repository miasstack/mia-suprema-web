/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server build for the VPS Docker image.
  output: 'standalone',
  reactStrictMode: true,
}

module.exports = nextConfig
