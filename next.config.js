/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['swiper'],
  images: {
    unoptimized: true, // Useful for exporting to static HTML or serving raw images from public/assets
  },
};

module.exports = nextConfig;

