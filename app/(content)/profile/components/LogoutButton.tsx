"use client";

import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import Cookies from "js-cookie";

import Button, { ButtonProps } from "@/components/Button";
import disableNotifications from "@/utils/disableNotifications";

export default function LogoutButton({ onClick, ...props }: ButtonProps) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  return (
    <Button
      onClick={async () => {
        try {
          if (localStorage.getItem("notifications-status") === "allowed") {
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
      Log out
    </Button>
  );
}
