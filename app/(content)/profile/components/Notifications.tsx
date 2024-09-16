"use client";

import { useEffect, useMemo, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import Cookies from "js-cookie";

import { API_URL, VAPID_KEY } from "@/constants";
import Button from "@/components/Button";
import Message from "@/components/Message";
import { app } from "@/lib/firebase";

export default function Notifications() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [error, setError] = useState<string>();
  const jwt = useMemo(() => Cookies.get("jwt")!, []);

  useEffect(() => {
    setIsMounted(true);
    if (!("Notification" in window)) {
      setIsSupported(false);
      setIsAllowed(false);
    } else if (Notification.permission === "granted") {
      setIsSupported(true);
      setIsAllowed(true);
    } else {
      setIsSupported(true);
      setIsAllowed(false);
    }
  }, []);

  if (!isMounted) return;

  let content;

  if (!isSupported) content = <p>المتصفح الخاص بك لا يدعم الإشعارات</p>;
  else if (isAllowed)
    content = <p>الإشعارات مفعلة يمكن تعطيلها من إعدادات المتصفح</p>;
  else
    content = (
      <>
        <Button
          onClick={async () => {
            try {
              const messaging = getMessaging(app);
              const permission = await Notification.requestPermission();
              if (permission !== "granted")
                throw new Error("لم يتم إعطاء الصلاحية");
              const token = await getToken(messaging, {
                vapidKey: VAPID_KEY,
              });
              if (!token)
                throw new Error("حدث خطأ غير متوقع يرجى إعادة المحاولة لاحقًا");
              const res = await fetch(`${API_URL}/user/register-device`, {
                method: "POST",
                headers: {
                  authorization: `Bearer ${jwt}`,
                  "content-type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({ token }),
              });
              const json = await res.json();
              if (!res.ok) throw new Error(json.message);
              setIsAllowed(true);
            } catch (err) {
              setError((err as Error).message);
            }
          }}
        >
          تفعيل الإشعارات
        </Button>
        {error && (
          <Message type="fail" className="mt-4">
            {error}
          </Message>
        )}
      </>
    );
  return <div className="mb-4">{content}</div>;
}
