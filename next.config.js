/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Useful for exporting to static HTML or serving raw images from public/assets
  },
};

module.exports = nextConfig;
