"use client";

import React, { useState } from "react";

import { Icon } from "./icons";
import FormItem from "./FormItem";

interface InputProps extends React.ComponentProps<"input"> {
  label: string;
  icon: Icon;
}

export default function Input({
  label,
  icon,
  id,
  className,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focus, setFocus] = useState(false);

  return (
    <FormItem
      label={label}
      icon={icon}
      focus={focus}
      id={id}
      className={className}
    >
      <input
        id={id}
        className="grow focus:outline-none"
        onFocus={(e) => {
          setFocus(true);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          if (onBlur) onBlur(e);
        }}
        {...props}
      />
    </FormItem>
  );
}
