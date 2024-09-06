"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

import Button, { ButtonProps } from "@/components/Button";

export default function LogoutButton({ onClick, ...props }: ButtonProps) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  return (
    <Button
      onClick={(e) => {
        Cookies.remove("jwt");
        mutate(() => true, undefined, { revalidate: false });
        router.replace("/login");
        if (onClick) onClick(e);
      }}
      {...props}
    >
      تسجيل الخروج
    </Button>
  );
}
