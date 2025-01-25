import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { NetworkOnly } from "@serwist/strategies";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Auth routes that should never be cached
const authRoutes = [
  "/api/auth/login",
  "/api/auth/callback",
  "/api/auth/logout",
  "/api/auth/me",
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Auth routes - Always network only
    {
      matcher: ({ url, sameOrigin }: { url: URL; sameOrigin: boolean }) => 
        sameOrigin && authRoutes.includes(url.pathname),
      handler: new NetworkOnly(),
    },
    // Add the default cache for everything else
    ...defaultCache,
  ],
});

serwist.addEventListeners();