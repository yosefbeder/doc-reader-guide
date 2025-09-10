"use client";

import React, { useCallback, useState } from "react";
import Dialogue from "./Dialogue";
import Button from "./Button";
import { useNotifications } from "@/lib/hooks";
import Message from "./Message";
import { logEvent } from "@/lib/event-logger";
import { Action } from "@/types";

export default function NotificationsToast() {
  const [isShown, setIsShown] = useState(true);
  const {
    isGuest,
    isMounted,
    isAllowed,
    isSupported,
    isLoading,
    error,
    toggle,
  } = useNotifications();
  const onClose = useCallback(() => {
    logEvent(null, null, Action.NOTIFICATIONS_TOAST_DENIED, {});
    localStorage.setItem("notifications-toast-denied", "true");
    setIsShown(false);
  }, []);

  if (
    isGuest ||
    !isMounted ||
    !isSupported ||
    isAllowed ||
    localStorage.getItem("notifications-toast-denied")
  )
    return;

  return (
    isShown && (
      <Dialogue
        header="Notifications"
        className="rounded-xl flex flex-col gap-2 max-[512px]:gap-4"
        onClose={onClose}
      >
        <h2 className="max-[512px]:hidden">Notifications</h2>
        <p>
          Intended to reduce distractions and the need to follow many telegram
          groups.
        </p>
        {error && <Message type="fail">{error}</Message>}
        <div className="flex gap-2">
          <Button isLoading={isLoading} onClick={toggle}>
            {isLoading ? "Loading..." : "Allow"}
          </Button>
          <Button color="white" onClick={onClose}>
            Don&apos;t allow
          </Button>
        </div>
      </Dialogue>
    )
  );
}
