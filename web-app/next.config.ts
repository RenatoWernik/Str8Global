import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com',
        pathname: '/**',
      },
    ],
  },
  // Temporarily hide /cursos — redirect to home while the page is offline.
  // Remove this block to re-enable the Cursos page.
  async redirects() {
    return [
      {
        source: '/cursos',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
