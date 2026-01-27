/** @type {import('next').NextConfig} */
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
  disable: process.env.NODE_ENV === "development",
  extendDefaultRuntimeCaching: true,
  cacheOnFrontEndNav: true,
  runtimeCaching: [
    {
      urlPattern: new RegExp(
        `^${(process.env.NEXT_PUBLIC_STATIC_URL || "").replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}/image/.*`,
        "i"
      ),
      handler: "CacheFirst",
      options: {
        cacheName: "cross-origin-images",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
  ],
})(nextConfig);
