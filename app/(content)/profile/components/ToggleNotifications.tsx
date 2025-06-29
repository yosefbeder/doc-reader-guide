"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button";
import disableNotifications from "@/utils/disableNotifications";
import allowNotifications from "@/utils/allowNotifications";
import Message from "@/components/Message";

export default function ToggleNotifications() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    if (!("Notification" in window)) {
      setIsSupported(false);
      return;
    }
    if (localStorage.getItem("notifications-status") === "allowed")
      setIsAllowed(true);
  }, []);

  if (!isMounted) return;

  if (!isSupported) return <p>Browser doesn't support notifications</p>;

  return (
    <>
      <Button
        color={isAllowed ? "rose" : "cyan"}
        disabled={isLoading}
        onClick={async () => {
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
        }}
      >
        {isLoading ? "Loading..." : isAllowed ? "Disable" : "Enable"}
      </Button>
      {error && <Message type="fail">{error}</Message>}
    </>
  );
}
