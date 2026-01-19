import React from "react";

export interface ButtonProps extends React.ComponentProps<"button"> {
  color?: "cyan" | "yellow" | "rose" | "white" | "pink";
  isLoading?: boolean;
}

export default function Button({
  color = "cyan",
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const colorVariants = {
    cyan: "text-white bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 border-cyan-600 hover:border-cyan-700 active:border-cyan-800 disabled:bg-slate-600 disabled:hover:bg-slate-700 disabled:border-slate-600 disabled:hover:border-slate-700",
    white:
      "text-cyan-600 border-2 border-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 dark:text-cyan-400 dark:border-cyan-400 dark:hover:bg-cyan-950 dark:active:bg-cyan-900",
    yellow:
      "text-slate-700 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 border-yellow-400 hover:border-yellow-500 active:border-yellow-600 disabled:text-white disabled:bg-slate-600 disabled:hover:bg-slate-700 disabled:border-slate-600 disabled:hover:border-slate-700",
    rose: "text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 border-rose-600 hover:border-rose-700 active:border-rose-800 disabled:bg-slate-600 disabled:hover:bg-slate-700 disabled:border-slate-600 disabled:hover:border-slate-700",
    pink: "text-white bg-pink-600 hover:bg-pink-700 active:bg-pink-800 border-pink-600 hover:border-pink-700 active:border-pink-800",
  };

  return (
    <button
      className={`py-1 px-4 border-2 rounded-full transition-colors disabled:cursor-not-allowed overflow-hidden ${colorVariants[color]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
