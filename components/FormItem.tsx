import React from "react";

import { Icon, icons } from "./icons";

interface FormItemNoIconProps {
  label: string;
  focus: boolean;
  id?: string;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function FormItemNoIcon({
  id,
  label,
  focus,
  className,
  disabled,
  children,
}: FormItemNoIconProps) {
  return (
    <label htmlFor={id}>
      <span className="block mb-2">{label}</span>
      <div
        className={`flex items-center gap-1 rounded-md p-1 border-2 bg-white transition-colors ${
          focus ? "border-cyan-600" : "border-slate-200"
        } ${
          disabled && "text-slate-400 bg-slate-50 cursor-not-allowed"
        } ${className}`}
      >
        {children}
      </div>
    </label>
  );
}

export default function FormItem({
  icon,
  children,
  ...props
}: {
  icon: Icon;
} & FormItemNoIconProps) {
  return (
    <FormItemNoIcon {...props}>
      <span className="p-2">{icons[icon]}</span>
      {children}
    </FormItemNoIcon>
  );
}
