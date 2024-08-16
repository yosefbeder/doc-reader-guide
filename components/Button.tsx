import React from "react";

export interface ButtonProps extends React.ComponentProps<"button"> {
  fullWidth?: boolean;
  color?: "cyan" | "yellow" | "rose";
}

export default function Button({
  fullWidth = false,
  color = "cyan",
  className,
  ...props
}: ButtonProps) {
  const colorVariants = {
    cyan: "text-white bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800",
    yellow:
      "text-inherit bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600",
    rose: "text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800",
  };

  return (
    <button
      className={`py-2 rounded-md transition-colors disabled:bg-slate-600 disabled:hover:bg-slate-700 disabled:cursor-not-allowed ${
        colorVariants[color]
      } ${fullWidth ? "w-full" : "px-4"} ${className}`}
      {...props}
    />
  );
}
