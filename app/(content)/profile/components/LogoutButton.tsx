"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { deleteToken, getMessaging, getToken } from "firebase/messaging";

import Button, { ButtonProps } from "@/components/Button";
import { API_URL, VAPID_KEY } from "@/constants";
import { app } from "@/lib/firebase";

export default function LogoutButton({ onClick, ...props }: ButtonProps) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  return (
    <Button
      onClick={async (e) => {
        if (onClick) onClick(e);
        try {
          const jwt = Cookies.get("jwt");
          Cookies.remove("jwt");
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            const messaging = getMessaging(app);
            const token = await getToken(messaging, { vapidKey: VAPID_KEY });
            const res = await fetch(`${API_URL}/user/unregister-device`, {
              method: "DELETE",
              headers: {
                authorization: `Bearer ${jwt}`,
                "content-type": "application/json;charset=UTF-8",
              },
              body: JSON.stringify({ token }),
            });
            const json = await res.json();
            await deleteToken(messaging);
            if (!res.ok) throw new Error(json.message);
          }
          await mutate(() => true, undefined, { revalidate: false });
          router.replace("/login");
        } catch (err) {
          console.error(err);
        }
      }}
      {...props}
    >
      تسجيل الخروج
    </Button>
  );
}
