import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import Cookies from "js-cookie";

import disableNotifications from "@/utils/disableNotifications";

export default function useLogout() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  return async () => {
    try {
      if (localStorage.getItem("notifications-status") === "allowed") {
        await disableNotifications();
      }
      Cookies.remove("jwt");
      localStorage.removeItem("notifications-toast-denied");
      await mutate(() => true, undefined, { revalidate: false });
      router.replace("/login");
    } catch (err) {
      console.error(err);
    }
  };
}
