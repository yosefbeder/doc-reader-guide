import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";

import allowNotifications from "@/utils/allowNotifications";
import disableNotifications from "@/utils/disableNotifications";
import useSettings from "./useSettings";
import { flush } from "../event-logger";

export default function useNotifications() {
  const [isGuest, setIsGuest] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { settings, updateSetting } = useSettings();
  const toggle = useCallback(async () => {
    setIsLoading(true);
    try {
      if (settings.notifications.allowed) {
        flush && (await flush());
        await disableNotifications();
      } else {
        const permission =
          Notification.permission === "granted"
            ? Notification.permission
            : await Notification.requestPermission();
        if (permission !== "granted")
          throw new Error("Notifications permission denied");
        await allowNotifications();
      }
      setError("");
      updateSetting(
        "notifications",
        "allowed",
        !settings.notifications.allowed
      );
      location.reload();
    } catch (err) {
      setError((err as Error).message);
    }
    setIsLoading(false);
  }, [settings]);

  useEffect(() => {
    setIsMounted(true);
    if (!("Notification" in window)) {
      setIsSupported(false);
      return;
    }
    if (!Cookies.get("guest")) setIsGuest(false);
  }, []);

  return {
    isGuest,
    isMounted,
    isAllowed: settings.notifications.allowed,
    isSupported,
    isLoading,
    error,
    toggle,
  };
}
