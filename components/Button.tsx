import React from "react";

export default function Button({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={`w-full py-2 rounded-md transition-colors text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-600 disabled:hover:bg-slate-700 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}
