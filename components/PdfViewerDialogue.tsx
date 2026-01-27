"use client";

import React from "react";
import Dialogue from "./Dialogue";
import { useOfflineMedia } from "@/lib/hooks/useOfflineMedia";

export default function PdfViewerDialogue({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const { resolvedUrl } = useOfflineMedia(url);
  const activeUrl = resolvedUrl || url;

  return (
    <Dialogue
      header={title}
      onClose={onClose}
      size="lg"
      className="rounded-xl col"
    >
      <iframe
        src={activeUrl}
        className="w-full h-full rounded-xl"
        title={title}
      />
    </Dialogue>
  );
}
