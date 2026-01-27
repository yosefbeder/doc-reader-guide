/** @type {import('next').NextConfig} */
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  turbopack: true,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  extendDefaultRuntimeCaching: true,
  runtimeCaching: [
    {
      urlPattern: "/",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "landing-page-cache",
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: "/app",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "app-home-cache",
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
  ],
})(nextConfig);
