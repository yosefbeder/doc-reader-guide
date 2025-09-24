"use client";

import React from "react";
import ButtonIcon from "./ButtonIcon";
import { useHotkeys } from "react-hotkeys-hook";

export default function Dialogue({
  header,
  className,
  onClose,
  children,
}: {
  header: string;
  className?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useHotkeys("Escape", onClose, [onClose]);

  return (
    <>
      <div
        className="fixed z-10 left-0 top-0 w-screen h-screen backdrop-blur-sm transition-all"
        onClick={onClose}
      />
      <div
        className={`fixed z-20 inset-0 my-8 mx-auto max-[512px]:m-0 p-2 max-[512px]:py-4 w-full max-w-lg h-max max-h-96 max-[512px]:h-screen max-[512px]:max-h-none overflow-y-scroll max-[512px]:rounded-none 
          layer-2
          ${className}`}
      >
        <div className="hidden max-[512px]:flex items-center justify-between">
          <h2 className="text-lg">{header}</h2>
          <ButtonIcon icon="x-mark" onClick={onClose} />
        </div>
        {children}
      </div>
    </>
  );
}
