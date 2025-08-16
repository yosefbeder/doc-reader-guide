"use client";

import Message from "@/components/Message";
import Toggle from "@/components/Toggle";
import { useNotifications } from "@/lib/hooks";

export default function ToggleNotifications() {
  const { isMounted, isAllowed, isSupported, isLoading, error, toggle } =
    useNotifications();

  if (!isMounted) return;

  if (!isSupported) return <p>Browser doesn&apos;t support notifications</p>;

  return (
    <>
      <Toggle
        disabled={isLoading}
        checked={isAllowed}
        onClick={toggle}
        label="Recieve"
      />
      {error && <Message type="fail">{error}</Message>}
    </>
  );
}
