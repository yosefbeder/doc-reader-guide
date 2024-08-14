import React from "react";

export interface ButtonProps extends React.ComponentProps<"button"> {
  fullWidth?: boolean;
}

export default function Button({
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`py-2 rounded-md transition-colors text-white bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 disabled:bg-slate-600 disabled:hover:bg-slate-700 disabled:cursor-not-allowed ${
        fullWidth ? "w-full" : "px-4"
      } ${className}`}
      {...props}
    />
  );
}
