import { getMessaging, getToken } from "firebase/messaging";
import Cookies from "js-cookie";

import { API_URL, VAPID_KEY } from "@/constants";
import { app } from "@/lib/firebase";

export default async function allowNotifications() {
  const jwt = Cookies.get("jwt")!;
  const messaging = getMessaging(app);
  let retry = 0;
  let token;
  while (retry < 3) {
    try {
      token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });
      break;
    } catch (err) {
      console.error(err);
      console.log("Retrying...");
      retry++;
    }
  }
  if (!token) throw new Error("حدث خطأ غير متوقع يرجى إعادة تحميل الصفحة");
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
  Cookies.set("notifications-status", "allowed");
}
