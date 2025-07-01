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
      className="rounded-3xl flex flex-col gap-2 max-[512px]:gap-4"
      onClose={onClose}
    >
      {children}
    </Dialogue>
  );
}
