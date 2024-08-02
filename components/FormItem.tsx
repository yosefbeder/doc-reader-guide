import React from "react";

import { Icon, icons } from "./icons";

export default function FormItem({
  id,
  label,
  icon,
  focus,
  className,
  disabled,
  children,
}: {
  label: string;
  icon: Icon;
  focus: boolean;
  id?: string;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id}>
      <span className="block mb-2">{label}</span>
      <div
        className={`flex items-center gap-2 rounded-md p-2 border-2 bg-white transition-colors ${
          focus ? "border-blue-600" : "border-slate-200"
        } ${disabled && "text-slate-400 cursor-not-allowed"} ${className}`}
      >
        {icons[icon]}
        {children}
      </div>
    </label>
  );
}
