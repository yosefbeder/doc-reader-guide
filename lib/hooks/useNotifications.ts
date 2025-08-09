import { useCallback, useEffect, useState } from "react";

import allowNotifications from "@/utils/allowNotifications";
import disableNotifications from "@/utils/disableNotifications";

export default function useNotifications() {
  const [isClassSelected, setIsClassSelected] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const toggle = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAllowed) {
        await disableNotifications();
        setIsAllowed(false);
      } else {
        const permission =
          Notification.permission === "granted"
            ? Notification.permission
            : await Notification.requestPermission();
        if (permission !== "granted")
          throw new Error("Notifications permission denied");
        await allowNotifications();
        setIsAllowed(true);
      }
      setError("");
      location.reload();
    } catch (err) {
      setError((err as Error).message);
    }
    setIsLoading(false);
  }, [isAllowed]);

  useEffect(() => {
    setIsMounted(true);
    if (!("Notification" in window)) {
      setIsSupported(false);
      return;
    }
    if (localStorage.getItem("notifications-status") === "allowed")
      setIsAllowed(true);
    if (localStorage.getItem("select-class") === "true") {
      setIsClassSelected(false);
      const intervalId = setInterval(() => {
        if (!localStorage.getItem("select-class")) {
          setIsClassSelected(true);
          clearInterval(intervalId);
        }
      }, 1000);
    }
  }, []);

  return {
    isClassSelected,
    isMounted,
    isAllowed,
    isSupported,
    isLoading,
    error,
    toggle,
  };
}
