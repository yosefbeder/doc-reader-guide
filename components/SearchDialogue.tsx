import React from "react";

import Dialogue from "./Dialogue";

export default function SearchDialogue({
  onClose,
  children,
}: {
  onClose: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
  children: React.ReactNode;
}) {
  return (
    <Dialogue
      header="Search for a lecture"
      className="rounded-3xl"
      onClose={onClose}
    >
      {children}
    </Dialogue>
  );
}
