import { openDB, DBSchema } from "idb";

export const DB_NAME = "doc-reader-offline";
export const DB_VERSION = 1;
export const ASSETS_CACHE_NAME = "doc-reader-assets";
export const PAGES_CACHE_NAME = "doc-reader-pages";

export interface OfflineDB extends DBSchema {
  meta: {
    key: number; // moduleId
    value: {
      timestamp: number;
      progress: number;
      status: "offline" | "downloading" | "error";
      keys: {
        type: "asset-cache" | "page-cache";
        key: string;
      }[];
    };
  };
}

export async function initDB() {
  return openDB<OfflineDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta");
      }
    },
  });
}
