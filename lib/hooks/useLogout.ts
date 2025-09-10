import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

import { googleLogout } from "@react-oauth/google";
import useNotifications from "./useNotifications";
import useSettings from "./useSettings";

export default function useLogout() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { toggle } = useNotifications();
  const { settings } = useSettings();

  return async () => {
    try {
      if (settings.notifications.allowed) {
        await toggle();
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Logout failed");
      }
      await mutate(() => true, undefined, { revalidate: false });
      localStorage.removeItem("notifications-toast-denied");
      localStorage.removeItem("select-class");
      localStorage.removeItem("user-id");
      googleLogout();
      router.replace("/login");
    } catch (err) {
      console.error(err);
    }
  };
}
