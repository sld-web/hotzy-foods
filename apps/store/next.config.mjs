/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@hotzy/ui', '@hotzy/api', '@hotzy/database', '@hotzy/validators'],
  devIndicators: false,
};

export default nextConfig;
