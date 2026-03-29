/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos'],
  },
  // In this environment, we might need to handle port 3000 specifically
  // but next dev -p 3000 should handle it.
};

export default nextConfig;
