import React from "react";

export interface ButtonProps extends React.ComponentProps<"button"> {
  fullWidth?: boolean;
  color?: "cyan" | "yellow" | "rose" | "white" | "violet";
  isLoading?: boolean;
  shimmer?: boolean;
}

export default function Button({
  fullWidth = false,
  color = "cyan",
  isLoading = false,
  shimmer = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const colorVariants = {
    cyan: "text-white bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 border-cyan-600 hover:border-cyan-700 active:border-cyan-800",
    white:
      "text-cyan-600 border-2 border-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 dark:text-cyan-400 dark:border-cyan-400 dark:hover:bg-cyan-950 dark:active:bg-cyan-900",
    yellow:
      "text-slate-700 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 border-yellow-400 hover:border-yellow-500 active:border-yellow-600 disabled:text-white",
    rose: "text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 border-rose-600 hover:border-rose-700 active:border-rose-800",
    violet:
      "text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 border-violet-600 hover:border-violet-700 active:border-violet-800",
  };

  return (
    <button
      className={`relative py-1 border-2 rounded-md transition-colors disabled:bg-slate-600 disabled:hover:bg-slate-700 disabled:border-slate-600 disabled:hover:border-slate-700 disabled:cursor-not-allowed overflow-hidden ${
        colorVariants[color]
      } ${fullWidth ? "w-full" : "px-2"} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {shimmer && (
        <div className="h-[80px] w-2 blur-sm -top-[20px] bg-gradient-to-r from-white/10 via-white/50 to-white/10 absolute rotate-45 animate-shimmer pointer-events-none" />
      )}
      {isLoading ? "Loading..." : children}
    </button>
  );
}
