"use client";

import React, { useState } from "react";
import { icons } from "./icons";

export default function Searchbar({
  className,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<"input">) {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={`flex items-center gap-1 rounded-3xl p-1 border-2 transition-colors
        ${
          focus
            ? "border-cyan-600 bg-white dark:bg-slate-800"
            : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
        } 
        ${className}`}
    >
      <span
        className={`p-2 ${
          focus ? "text-inherit" : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {icons["magnifying-glass"]}
      </span>
      <input
        type="text"
        className="grow disabled:pointer-events-none focus:outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
        onFocus={(e) => {
          setFocus(true);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          if (onBlur) onBlur(e);
        }}
        autoFocus
        {...props}
      />
    </div>
  );
}
