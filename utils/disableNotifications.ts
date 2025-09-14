import { deleteToken, getMessaging, getToken } from "firebase/messaging";

import { app } from "@/lib/firebase";

export default async function disableNotifications() {
  const deviceId = localStorage.getItem("device-id");
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
  if (!res.ok) throw new Error(json.message);
  const messaging = getMessaging(app);
  await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
  });
  await deleteToken(messaging);
  localStorage.removeItem("fcm-token");
  localStorage.removeItem("device-id");
}
