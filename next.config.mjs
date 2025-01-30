/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: ['hvgusjfevfbhfminbmtc.supabase.co', 'www.gravatar.com'],
  },
};

export default nextConfig;