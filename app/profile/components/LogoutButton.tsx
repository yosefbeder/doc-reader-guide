"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import Button, { ButtonProps } from "@/components/Button";

export default function LogoutButton({ onClick, ...props }: ButtonProps) {
  const router = useRouter();
  return (
    <Button
      onClick={(e) => {
        Cookies.remove("jwt");
        router.replace("/login");
        if (onClick) onClick(e);
      }}
      {...props}
    >
      تسجيل الخروج
    </Button>
  );
}
