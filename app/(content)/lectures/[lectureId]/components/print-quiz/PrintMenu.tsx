"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function PrintMenu({
  anchorRef,
  onPrint,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLDivElement>;
  onPrint: (
    mode: "booklet-with-answers" | "booklet-without-answers" | "study"
  ) => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, anchorRef]);

  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.right,
        transform: "translateX(-100%)",
        zIndex: 20,
      });
    }
  }, [anchorRef]);

  return createPortal(
    <div
      ref={containerRef}
      className="flex flex-col p-2 gap-2 rounded-xl layer-2"
      style={style}
    >
      <button
        onClick={() => onPrint("booklet-with-answers")}
        className="text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
      >
        Booklet with answers
      </button>
      <button
        onClick={() => onPrint("booklet-without-answers")}
        className="text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
      >
        Booklet without answers
      </button>
      <button
        onClick={() => onPrint("study")}
        className="text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
      >
        Study mode
      </button>
    </div>,
    document.body
  );
}
