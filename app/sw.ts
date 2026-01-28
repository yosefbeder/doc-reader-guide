/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { ExpirationPlugin, NetworkFirst, Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const manifest = self.__SW_MANIFEST;
const filteredManifest = manifest?.filter((entry) => {
  const url = typeof entry === "string" ? entry : entry.url;
  return !url.includes("MiddlewareManifest") && !url.includes(".map");
});

const serwist = new Serwist({
  precacheEntries: filteredManifest,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: new NetworkFirst({
        cacheName: "doc-reader-pages",
        networkTimeoutSeconds: 5,
        plugins: [
          new ExpirationPlugin({
            maxAgeSeconds: 0,
          }),
        ],
      }),
    },
    {
      matcher: ({ url }) => url.pathname.includes("/v2/"),
      handler: new NetworkFirst({
        cacheName: "doc-reader-api",
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
