"use client";

import Button from "@/components/Button";
import Message from "@/components/Message";
import { useNotifications } from "@/lib/hooks";

export default function ToggleNotifications() {
  const { isMounted, isAllowed, isSupported, isLoading, error, toggle } =
    useNotifications();

  if (!isMounted) return;

  if (!isSupported) return <p>Browser doesn&apos;t support notifications</p>;

  return (
    <>
      <Button
        color={isAllowed ? "rose" : "cyan"}
        disabled={isLoading}
        onClick={toggle}
      >
        {isLoading ? "Loading..." : isAllowed ? "Disable" : "Enable"}
      </Button>
      {error && <Message type="fail">{error}</Message>}
    </>
  );
}
