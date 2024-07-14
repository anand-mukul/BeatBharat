/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      }
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:7777/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
