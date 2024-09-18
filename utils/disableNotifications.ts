import { deleteToken, getMessaging, getToken } from "firebase/messaging";
import Cookies from "js-cookie";

import { API_URL, VAPID_KEY } from "@/constants";
import { app } from "@/lib/firebase";

export default async function disableNotifications() {
  const jwt = Cookies.get("jwt")!;
  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
  });
  await deleteToken(messaging);
  const res = await fetch(`${API_URL}/user/unregister-device`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${jwt}`,
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ token }),
  });
  const json = await res.json();
  localStorage.setItem("notifications-status", "disabled");
  if (!res.ok) throw new Error(json.message);
}
