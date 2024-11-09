"use client";

import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import Cookies from "js-cookie";

import ButtonIcon from "./ButtonIcon";
import { app } from "@/lib/firebase";
import { API_URL, VAPID_KEY } from "@/constants";

export default function NotificationListener() {
  const [notifications, setNotifications] = useState<
    { id: string; title: string; body: string; closed: boolean }[]
  >([]);

  useEffect(() => {
    if (localStorage.getItem("notifications-status") === "allowed") {
      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey: VAPID_KEY,
      }).then(async (token) => {
        const storedToken = localStorage.getItem("fcm-token");
        if (token !== storedToken) {
          console.log("Token was revalidated!\nSyncing database...");
          const jwt = Cookies.get("jwt")!;
          const deleteRes = await fetch(`${API_URL}/user/unregister-device`, {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${jwt}`,
              "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({ storedToken }),
          });
          const deleteJson = await deleteRes.json();
          if (!deleteRes.ok)
            console.error(
              "Removing old token from database failed!",
              deleteJson.message
            );
          const addRes = await fetch(`${API_URL}/user/register-device`, {
            method: "POST",
            headers: {
              authorization: `Bearer ${jwt}`,
              "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({ token }),
          });
          const json = await addRes.json();
          if (!addRes.ok)
            console.error("Adding new token to database failed!", json.message);
          localStorage.setItem("fcm-token", token);
          location.reload();
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
