"use client";

import React from "react";
import ButtonIcon from "./ButtonIcon";
import { useHotkeys } from "react-hotkeys-hook";

export default function Dialogue({
  header,
  className,
  size = "md",
  onClose,
  children,
}: {
  header: string | React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClose: () => void;
  children: React.ReactNode;
}) {
  useHotkeys("Escape", onClose, [onClose]);
  const sizeDialogueClass = {
    lg: "max-w-2xl max-[672px]:m-0 max-[672px]:py-4 max-[672px]:h-screen max-[672px]:max-h-none max-[672px]:rounded-none",
    md: "max-w-lg max-[512px]:m-0 max-[512px]:py-4 max-[512px]:h-screen max-[512px]:max-h-none max-[512px]:rounded-none",
    sm: "max-w-sm max-[384px]:m-0 max-[384px]:py-4 max-[384px]:h-screen max-[384px]:max-h-none max-[384px]:rounded-none",
  };
  const headerClass = {
    lg: "max-[672px]:flex",
    md: "max-[512px]:flex",
    sm: "max-[384px]:flex",
  };

  return (
    <>
      <div
        className="fixed z-10 left-0 top-0 w-screen h-screen backdrop-blur-sm transition-all"
        onClick={onClose}
      />
      <div
        className={`fixed z-20 inset-0 my-8 mx-auto p-2 w-full h-max max-h-[90vh] overflow-y-scroll 
          layer-2
          ${sizeDialogueClass[size]}
          ${className}`}
      >
        <div
          className={`hidden w-full items-center justify-between ${headerClass[size]}`}
        >
          <h2>{header}</h2>
          <ButtonIcon icon="x-mark" onClick={onClose} />
        </div>
        {children}
      </div>
    </>
  );
}
