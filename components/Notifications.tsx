"use client";

import "react-checkbox-tree/lib/react-checkbox-tree.css";

import { useCallback, useState } from "react";
import { icons } from "./icons";
import NotificationsDialogue from "./NotificationsDialogue";

export default function Notifications({ yearId }: { yearId: number }) {
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const onOpen = useCallback(() => setIsDialogueOpen(true), []);
  const onClose = useCallback(() => setIsDialogueOpen(false), []);

  return (
    <>
      <button className="radio p-2" onClick={onOpen}>
        {icons["bell"]}
      </button>
      {isDialogueOpen && (
        <NotificationsDialogue yearId={yearId} onClose={onClose} />
      )}
    </>
  );
}
