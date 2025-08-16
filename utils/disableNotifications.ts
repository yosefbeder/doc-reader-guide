import { deleteToken, getMessaging, getToken } from "firebase/messaging";
import Cookies from "js-cookie";

import { app } from "@/lib/firebase";

export default async function disableNotifications() {
  const deviceId = localStorage.getItem("device-id");
  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
  });
  await deleteToken(messaging);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me/devices/${deviceId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );
  const json = await res.json();
  localStorage.removeItem("fcm-token");
  localStorage.removeItem("device-id");
  if (!res.ok) throw new Error(json.message);
}
