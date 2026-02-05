/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";

const nextConfig = {
  experimental: {
    proxyClientMaxBodySize: "50mb",
  },
  serverExternalPackages: ["esbuild-wasm"],
};

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist(nextConfig);
