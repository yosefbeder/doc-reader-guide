import React from "react";

import { Icon, icons } from "./icons";

interface FormItemNoIconProps {
  label: string | React.ReactNode;
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
      {(() => {
        if (typeof label === "string")
          return <span className="block mb-2">{label}</span>;
        else return label;
      })()}

      <div
        className={`
    flex items-center gap-1 rounded-md p-1 border-2 transition-colors
    ${focus ? "border-cyan-600" : "border-slate-200 dark:border-slate-700"}
    bg-white dark:bg-slate-900
    ${
      disabled &&
      "text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 cursor-not-allowed"
    }
    ${className}
  `}
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
