"use client";

import React, { useState } from "react";

import { icons } from "./icons";

export default function Searchbar({
  className,
  onFocus,
  onBlur,
  placeholder: _placeholder,
  ...props
}: React.ComponentProps<"input">) {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={`flex items-center gap-1 rounded-3xl p-1 border-2 transition-colors ${
        focus ? "border-cyan-600 bg-white" : "border-slate-200 bg-slate-50"
      } ${className}`}
    >
      <span className={`p-2 ${focus ? "text-inherit" : "text-slate-500"}`}>
        {icons["magnifying-glass"]}
      </span>
      <input
        type="text"
        className="grow bg-transparent disabled:pointer-events-none focus:outline-none placeholder:text-slate-500 max-[512px]:placeholder-transparent"
        onFocus={(e) => {
          setFocus(true);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          if (onBlur) onBlur(e);
        }}
        autoFocus
        placeholder="Search for a lecture"
        {...props}
      />
    </div>
  );
}
