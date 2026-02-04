import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { logEvent } from "../event-logger";
import { Action, Resource } from "@/types";

const CACHE_NAME = "offline-media-v1";

export function useOfflineMedia(url: string | undefined, linkId: number) {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkCache = useCallback(async () => {
    if (!url) return;
    try {
      if ("caches" in window) {
        const cache = await caches.open(CACHE_NAME);
        const match = await cache.match(url);
        if (match) {
          setIsDownloaded(true);
          const blob = await match.blob();
          setBlobUrl(URL.createObjectURL(blob));
        } else {
          setIsDownloaded(false);
          setBlobUrl(null);
        }
      }
    } catch (error) {
      console.error("Error checking cache:", error);
    }
  }, [url]);

  useEffect(() => {
    checkCache();
  }, [checkCache]);

  // Prevent tab close during download
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isLoading]);

  const cancelDownload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      toast.dismiss("download-" + url);
      toast.info("Download cancelled");
    }
  }, [url]);

  const download = async () => {
    if (!url) return;
    logEvent(Resource.LINK, linkId, Action.DOWNLOAD, {});
    setIsLoading(true);
    const toastId = "download-" + url;

    toast.loading("Starting download...", {
      id: toastId,
      action: {
        label: "Cancel",
        onClick: cancelDownload,
      },
    });

    abortControllerRef.current = new AbortController();

    try {
      if ("caches" in window) {
        const cache = await caches.open(CACHE_NAME);
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const contentLength = response.headers.get("content-length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        let loaded = 0;

        const stream = new ReadableStream({
          async start(controller) {
            const reader = response.body?.getReader();
            if (!reader) {
              controller.close();
              return;
            }

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  controller.close();
                  break;
                }
                loaded += value.byteLength;

                if (total) {
                  const progress = Math.round((loaded / total) * 100);
                  toast.loading(`Downloading... ${progress}%`, { id: toastId });
                } else {
                  const mb = (loaded / (1024 * 1024)).toFixed(1);
                  toast.loading(`Downloading... ${mb}MB`, { id: toastId });
                }

                controller.enqueue(value);
              }
            } catch (error) {
              controller.error(error);
              throw error;
            }
          },
        });

        const newResponse = new Response(stream, {
          headers: response.headers,
        });

        await cache.put(url, newResponse);
        await checkCache();
        toast.dismiss(toastId);
        toast.success("Downloaded");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Download aborted via controller");
      } else {
        console.error("Error downloading resource:", error);
        toast.error("Download failed", { id: toastId });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const deleteFile = async () => {
    if (!url) return;
    logEvent(Resource.LINK, linkId, Action.DELETE, {});
    try {
      if ("caches" in window) {
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(url);
        await checkCache();
        toast.success("Deleted from cache");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete");
    }
  };

  return {
    isDownloaded,
    isLoading,
    download,
    cancelDownload,
    deleteFile,
    getBlobUrl: () => blobUrl || url,
    resolvedUrl: blobUrl || url,
  };
}
