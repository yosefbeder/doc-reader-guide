import React from "react";

import { icons } from "./icons";

export default function SearchNavButton({
  className,
  children: _children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={`flex items-center px-2 py-1 gap-2 rounded-3xl bg-slate-50 border-2 border-slate-200 text-slate-500 ${className}`}
      {...props}
    >
      {icons["magnifying-glass"]}
      Search...
    </button>
  );
}
