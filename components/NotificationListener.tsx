"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import ButtonIcon from "./ButtonIcon";

import { API_URL, VAPID_KEY } from "@/constants";
import { app } from "@/lib/firebase";

export default function NotificationListener() {
  const [notifications, setNotifications] = useState<
    { id: string; title: string; body: string; closed: boolean }[]
  >([]);
  const jwt = useMemo(() => Cookies.get("jwt")!, []);
  useEffect(() => {
    (async () => {
      try {
        if (
          !("Notification" in window) ||
          Notification.permission !== "granted"
        )
          return;
        const messaging = getMessaging(app);
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
        });
        if (!token)
          throw new Error(
            "حدث خطأ غير متوقع أثناء تجهيز الإشعارات يرجى إعادة المحاولة لاحقًا"
          );
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
        onMessage(messaging, (payload) =>
          setNotifications((prev) => [
            ...prev,
            {
              id: payload.messageId,
              title: payload.notification!.title!,
              body: payload.notification!.body!,
              closed: false,
            },
          ])
        );
      } catch (err) {
        console.error((err as Error).message);
      }
    })();
  }, []);

  return (
    <ul className="fixed z-20 inset-0 my-2 mx-auto px-2 flex flex-col gap-2 max-w-96 h-max">
      {notifications.map(
        ({ id, title, body, closed }) =>
          !closed && (
            <li key={id} className="w-full bg-white rounded-xl p-2 shadow-lg">
              <div className="flex justify-between items-center">
                <h3>{title}</h3>
                <ButtonIcon
                  icon="x-mark"
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((notification) =>
                        notification.id === id
                          ? { ...notification, closed: true }
                          : notification
                      )
                    )
                  }
                />
              </div>
              <p className="whitespace-pre-line">{body}</p>
            </li>
          )
      )}
    </ul>
  );
}
