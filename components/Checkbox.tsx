import React from "react";

export interface CheckboxProps extends React.ComponentProps<"input"> {
  label?: React.ReactNode;
  color?: "cyan" | "yellow" | "rose" | "violet";
}

export default function Checkbox({
  label,
  color = "cyan",
  className = "",
  ...props
}: CheckboxProps) {
  const colorVariants: Record<string, string> = {
    cyan: "accent-cyan-600 focus:ring-cyan-500 border-cyan-300",
    yellow: "accent-yellow-400 focus:ring-yellow-500 border-yellow-300",
    rose: "accent-rose-600 focus:ring-rose-500 border-rose-300",
    violet: "accent-violet-600 focus:ring-violet-500 border-violet-300",
  };
  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}
    >
      <input
        type="checkbox"
        className={`h-5 w-5 rounded-md border-2 transition-colors focus:ring-2 ${colorVariants[color]}`}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
