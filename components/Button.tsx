import React from "react";

export interface ButtonProps extends React.ComponentProps<"button"> {
  fullWidth?: boolean;
  color?: "cyan" | "yellow" | "rose" | "white" | "violet" | "slate";
  isLoading?: boolean;
}

export default function Button({
  fullWidth = false,
  color = "cyan",
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const colorVariants = {
    cyan: "text-white bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 border-cyan-600 hover:border-cyan-700 active:border-cyan-800",
    white:
      "text-cyan-600 border-2 border-cyan-600 hover:bg-cyan-50 active:bg-cyan-100",
    slate:
      "text-slate-700 border-2 border-slate-700 hover:bg-slate-50 active:bg-slate-100",
    yellow:
      "text-inherit bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 border-yellow-400 hover:border-yellow-500 active:border-yellow-600 disabled:text-white",
    rose: "text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 border-rose-600 hover:border-rose-700 active:border-rose-800",
    violet:
      "text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 border-violet-600 hover:border-violet-700 active:border-violet-800",
  };

  return (
    <button
      className={`py-1 border-2 rounded-md transition-colors disabled:bg-slate-600 disabled:hover:bg-slate-700 disabled:border-slate-600 disabled:hover:border-slate-700 disabled:cursor-not-allowed ${
        colorVariants[color]
      } ${fullWidth ? "w-full" : "px-2"} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
