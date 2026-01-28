import { useState, useEffect, useCallback, useRef } from "react";
import {
  saveModuleToOffline,
  removeModuleFromOffline,
} from "@/utils/offline-storage";
import { initDB } from "@/utils/idb";
import { toast } from "sonner";

export default function useOfflineModule(moduleId: number) {
  const [status, setStatus] = useState<
    "offline" | "downloading" | "error" | null
  >(null);
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const db = await initDB();
      const meta = await db.get("meta", moduleId);
      if (meta) {
        setStatus(meta.status);
        setProgress(meta.progress);
      } else {
        setStatus(null);
        setProgress(0);
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
    try {
      setStatus("downloading");
      setProgress(0);

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
        (p) => {
          setProgress(p);
          toast.loading(`Downloading module... ${Math.round(p)}%`, {
            id: toastId,
          });
        },
        controller.signal
      );

      toast.dismiss(toastId);
      toast.success("Module saved offline successfully!");
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
      const toastId = toast.loading("Removing offline module...");
      await removeModuleFromOffline(moduleId); // Pass moduleId
      toast.dismiss(toastId);
      toast.success("Offline module removed.");
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
    progress,
    remove,
  };
}
