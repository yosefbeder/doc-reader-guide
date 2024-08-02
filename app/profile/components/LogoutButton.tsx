"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        Cookies.remove("jwt");
        router.replace("/login");
      }}
    >
      تسجيل الخروج
    </Button>
  );
}
