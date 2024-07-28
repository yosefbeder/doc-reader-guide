"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        Cookies.remove("jwt");
        router.replace("/login");
      }}
    >
      تسجيل الخروج
    </button>
  );
}
