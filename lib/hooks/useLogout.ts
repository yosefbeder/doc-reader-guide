import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

import disableNotifications from "@/utils/disableNotifications";
import { googleLogout } from "@react-oauth/google";

export default function useLogout() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  return async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Logout failed");
      }
      if (localStorage.getItem("notifications-status") === "allowed") {
        await disableNotifications();
      }
      await mutate(() => true, undefined, { revalidate: false });
      localStorage.removeItem("notifications-toast-denied");
      localStorage.removeItem("select-class");
      googleLogout();
      router.replace("/login");
    } catch (err) {
      console.error(err);
    }
  };
}
