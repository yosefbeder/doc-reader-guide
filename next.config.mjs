/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "doc-reader-guide-server.online",
        port: "8080",
        pathname: "/image/**",
      },
    ],
  },
};

export default nextConfig;
