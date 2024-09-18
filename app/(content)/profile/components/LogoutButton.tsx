"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { deleteToken, getMessaging, getToken } from "firebase/messaging";

import Button, { ButtonProps } from "@/components/Button";
import { API_URL, VAPID_KEY } from "@/constants";
import { app } from "@/lib/firebase";
import disableNotifications from "@/utils/disableNotifications";

export default function LogoutButton({ onClick, ...props }: ButtonProps) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  return (
    <Button
      onClick={async () => {
        try {
          if (Cookies.get("notifications-status") === "allowed") {
            await disableNotifications();
          }
          Cookies.remove("jwt");
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
