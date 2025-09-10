"use client";

import Button, { ButtonProps } from "@/components/Button";
import { logEvent } from "@/lib/event-logger";
import { useLogout } from "@/lib/hooks";
import { Action, Resource, User } from "@/types";

interface LogoutButtonProps extends ButtonProps {
  user: User;
}

export default function LogoutButton({
  user,
  onClick,
  ...props
}: LogoutButtonProps) {
  const logout = useLogout();

  return (
    <Button
      onClick={() => {
        logEvent(Resource.USER, user.id, Action.LOGOUT, {});
        logout();
      }}
      color="rose"
      {...props}
    >
      Log out
    </Button>
  );
}
