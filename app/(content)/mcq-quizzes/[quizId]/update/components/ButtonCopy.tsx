"use client";

import ButtonIcon from "@/components/ButtonIcon";
import React from "react";

export default function ButtonCopy({ text }: { text: string }) {
  return (
    <ButtonIcon
      icon="clipboard-document-list"
      className="w-max"
      onClick={() => {
        if (navigator)
          navigator.clipboard
            .writeText(text)
            .then(() => alert("Copied successfully!"))
            .catch((err) => alert("Failed to copy: " + err));
      }}
    />
  );
}
