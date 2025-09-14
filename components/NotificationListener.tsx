"use client";

import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import ButtonIcon from "./ButtonIcon";
import { app } from "@/lib/firebase";
import useSettings from "@/lib/hooks/useSettings";

export default function NotificationListener() {
  const [notifications, setNotifications] = useState<
    { id: string; title: string; body: string; closed: boolean }[]
  >([]);
  const [settings] = useSettings();

  useEffect(() => {
    if (settings.notifications.allowed) {
      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      }).then(async (token) => {
        const storedToken = localStorage.getItem("fcm-token");
        const deviceId = localStorage.getItem("device-id");
        if (token !== storedToken) {
          console.log("Token was revalidated!\nSyncing database...");
          const deleteRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/me/devices/${deviceId}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );
          const deleteJson = await deleteRes.json();
          if (!deleteRes.ok)
            console.error(
              "Removing old token from database failed!",
              deleteJson.message
            );
          const addRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/me/devices`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "content-type": "application/json;charset=UTF-8",
              },
              body: JSON.stringify({ token }),
            }
          );
          const json = await addRes.json();
          if (!addRes.ok)
            console.error("Adding new token to database failed!", json.message);
          else {
            localStorage.setItem("device-id", json.data.device.id);
            localStorage.setItem("fcm-token", token);
            location.reload();
          }
        }
      });

      return onMessage(messaging, (payload) =>
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
    }
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
