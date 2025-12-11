import React from "react";

export interface FilterButtonProps extends React.ComponentProps<"button"> {
  active?: boolean;
  color?: "gray" | "green" | "red" | "yellow";
}

export default function FilterButton({
  active = false,
  color = "gray",
  className = "",
  children,
  ...props
}: FilterButtonProps) {
  const activeVariants = {
    gray: "bg-slate-100 border-slate-700/50 text-slate-900 dark:bg-slate-800 dark:border-slate-500 dark:text-slate-100",
    green:
      "bg-green-100 border-green-700/50 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
    red: "bg-red-100 border-red-700/50 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
    yellow:
      "bg-yellow-100 text-yellow-900 border-yellow-700/50 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800",
  };

  const inactiveVariants = {
    gray: "text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800",
    green:
      "text-green-800 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30",
    red: "text-red-800 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30",
    yellow:
      "text-yellow-800 border-yellow-200 hover:bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/30",
  };

  const variantClass = active ? activeVariants[color] : inactiveVariants[color];

  return (
    <button
      className={`px-3 py-1 border rounded-full text-sm font-medium transition-colors ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
