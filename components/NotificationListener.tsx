"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getMessaging, onMessage } from "firebase/messaging";

import ButtonIcon from "./ButtonIcon";
import { app } from "@/lib/firebase";

export default function NotificationListener() {
  const [notifications, setNotifications] = useState<
    { id: string; title: string; body: string; closed: boolean }[]
  >([]);

  useEffect(() => {
    if (Cookies.get("notifications-status") === "allowed") {
      const messaging = getMessaging(app);

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
