"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { icons } from "./icons";

interface SummaryDetailContextValue {
  open: boolean;
  toggle: () => void;
}

const SummaryDetailContext = createContext<SummaryDetailContextValue | null>(
  null
);

interface SummaryDetailProps {
  id?: string;
  open: boolean;
  toggle: () => void;
  className?: string;
  children: ReactNode;
}

export function SummaryDetail({
  id,
  open,
  toggle,
  className,
  children,
}: SummaryDetailProps) {
  return (
    <SummaryDetailContext.Provider value={{ open, toggle }}>
      <div
        id={id}
        className={`overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/50 ${className}`}
      >
        {children}
      </div>
    </SummaryDetailContext.Provider>
  );
}

interface SummaryProps {
  children: ReactNode;
  activeClasses?: string;
  inactiveClasses?: string;
}

SummaryDetail.Summary = function Summary({
  children,
  activeClasses = "bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-black",
  inactiveClasses = "hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-200",
}: SummaryProps) {
  const ctx = useContext(SummaryDetailContext);
  if (!ctx) throw new Error("Summary must be used within SummaryDetail");
  const { open, toggle } = ctx;

  return (
    <button
      onClick={toggle}
      className={`w-full text-left flex items-center gap-2 p-2 rounded-b-xl ${
        open ? activeClasses : inactiveClasses
      } transition-colors`}
    >
      {open ? icons["chevron-down"] : icons["chevron-right"]}
      {children}
    </button>
  );
};

interface DetailProps {
  optimizeForSEO?: boolean;
  children: ReactNode;
}

SummaryDetail.Detail = function Detail({
  children,
  optimizeForSEO = true,
}: DetailProps) {
  const ctx = useContext(SummaryDetailContext);
  if (!ctx) throw new Error("Detail must be used within SummaryDetail");
  const { open } = ctx;

  return (
    <div className={open ? "overflow-y-scroll" : "hidden"}>
      {optimizeForSEO ? children : open ? children : null}
    </div>
  );
};
