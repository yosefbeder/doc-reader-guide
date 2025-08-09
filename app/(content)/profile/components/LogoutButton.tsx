"use client";

import Button, { ButtonProps } from "@/components/Button";
import { useLogout } from "@/lib/hooks";

export default function LogoutButton({ onClick, ...props }: ButtonProps) {
  const logout = useLogout();

  return (
    <Button onClick={logout} color="rose" {...props}>
      Log out
    </Button>
  );
}
