import React from "react";
import { Icon, icons } from "./icons";

export default function FormItem({
  id,
  label,
  icon,
  focus,
  className,
  children,
}: {
  label: string;
  icon: Icon;
  focus: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <label htmlFor={id} className="block mb-2">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-md p-2 border-2 bg-white transition-colors ${
          focus ? "border-blue-600" : "border-slate-200"
        } ${className}`}
      >
        <label htmlFor={id}>{icons[icon]}</label>
        {children}
      </div>
    </>
  );
}