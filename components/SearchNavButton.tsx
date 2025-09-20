import React from "react";
import { icons } from "./icons";

export default function SearchNavButton({
  className,
  children: _children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={`flex items-center px-2 py-1 gap-2 rounded-3xl
        bg-slate-50 dark:bg-slate-800
        border-2 border-slate-200 dark:border-slate-700
        text-slate-500 dark:text-slate-300
        ${className}`}
      {...props}
    >
      {icons["magnifying-glass"]}
      Search...
    </button>
  );
}
