import React from "react";

import { Icon, icons } from "./icons";

interface ButtonIconProps extends React.ComponentProps<"button"> {
  icon: Icon;
}

export default function ButtonIcon({
  icon,
  className,
  children: _children,
  ...props
}: ButtonIconProps) {
  return (
    <button
      className={`rounded-full p-2 
              hover:bg-slate-50 active:bg-slate-100 
              dark:hover:bg-slate-800 dark:active:bg-slate-700 
              transition-colors ${className}`}
      {...props}
    >
      {icons[icon]}
    </button>
  );
}
