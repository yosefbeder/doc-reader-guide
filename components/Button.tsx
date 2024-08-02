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
      className={`py-2 rounded-md transition-colors text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-600 disabled:hover:bg-slate-700 disabled:cursor-not-allowed ${
        fullWidth ? "w-full" : "px-4"
      } ${className}`}
      {...props}
    />
  );
}
