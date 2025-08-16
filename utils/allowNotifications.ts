import { deleteToken, getMessaging, getToken } from "firebase/messaging";
import Cookies from "js-cookie";

import { app } from "@/lib/firebase";

export default async function allowNotifications() {
  const jwt = Cookies.get("jwt")!;
  const messaging = getMessaging(app);
  await deleteToken(messaging);
  let retry = 0;
  let token;
  while (retry < 3) {
    try {
      token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });
      break;
    } catch (err) {
      console.error(err);
      console.log("Retrying...");
      retry++;
    }
  }
  if (!token) throw new Error("Error");
  const res = await fetch(
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
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  localStorage.setItem("fcm-token", token);
  localStorage.setItem("device-id", json.data.device.id);
}
