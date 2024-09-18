"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import Button from "@/components/Button";
import disableNotifications from "@/utils/disableNotifications";
import allowNotifications from "@/utils/allowNotifications";
import Message from "@/components/Message";

export default function ToggleNotifications() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    if (!("Notification" in window)) {
      setIsSupported(false);
      return;
    }
    if (Cookies.get("notifications-status") === "allowed") setIsAllowed(true);
  }, []);

  if (!isMounted) return;

  if (!isSupported) return <p>المتصفح الحالي لا يدعم خاصية الإشعارات</p>;

  return (
    <>
      <Button
        color={isAllowed ? "rose" : "cyan"}
        onClick={async () => {
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
                throw new Error("لم يتم إعطاء الصلاحية لإرسال الإشعارات");
              await allowNotifications();
              setIsAllowed(true);
            }
            setError("");
            location.reload();
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        {isAllowed ? "تعطيل" : "تفعيل"}
      </Button>
      {error && <Message type="fail">{error}</Message>}
    </>
  );
}
