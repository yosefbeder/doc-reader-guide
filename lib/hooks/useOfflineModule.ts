import { useState, useEffect, useCallback, useRef } from "react";
import {
  saveModuleToOffline,
  removeModuleFromOffline,
} from "@/utils/offline-storage";
import { initDB } from "@/utils/idb";
import { toast } from "sonner";
import { logEvent } from "@/lib/event-logger";
import { Action, Resource } from "@/types";

const toMb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

export default function useOfflineModule(moduleId: number) {
  const [status, setStatus] = useState<
    "offline" | "downloading" | "error" | null
  >(null);
  const [bytes, setBytes] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const db = await initDB();
      const meta = await db.get("meta", moduleId);
      if (meta) {
        setStatus(meta.status);
        setBytes(meta.bytes || 0);
      } else {
        setStatus(null);
        setBytes(0);
      }
    } catch (e) {
      console.error("Failed to check offline status", e);
    }
  }, [moduleId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === "downloading") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [status]);

  const download = async () => {
    logEvent(Resource.MODULE, moduleId, Action.DOWNLOAD, {});
    try {
      setStatus("downloading");
      setBytes(0);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const toastId = toast.loading("Downloading module...", {
        cancel: {
          label: "Cancel",
          onClick: () => {
            controller.abort();
            setStatus(null);
          },
        },
        duration: Infinity,
      });

      await saveModuleToOffline(
        moduleId,
        (bytes) => {
          setBytes(bytes);
          toast.loading(`Downloading module... ${toMb(bytes)} MB`, {
            id: toastId,
          });
        },
        controller.signal
      );

      toast.dismiss(toastId);
      toast.success(`Module saved offline successfully! (${toMb(bytes)} MB)`);
      checkStatus();
    } catch (error: any) {
      if (error.message === "Aborted") {
        toast.dismiss();
        toast("Download cancelled");
        setStatus(null);
        try {
          await removeModuleFromOffline(moduleId);
        } catch (e) {}
        checkStatus();
      } else {
        console.error(error);
        setStatus("error");
        toast.error("Failed to download module.");
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const remove = async () => {
    try {
      logEvent(Resource.MODULE, moduleId, Action.DELETE, {});
      const toastId = toast.loading("Removing offline module...");
      await removeModuleFromOffline(moduleId); // Pass moduleId
      toast.dismiss(toastId);
      toast.success(`Offline module removed! (${toMb(bytes)} MB)`);
      checkStatus();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove offline module.");
    }
  };

  return {
    isOffline: status === "offline",
    isDownloading: status === "downloading",
    download,
    bytes,
    remove,
  };
}
