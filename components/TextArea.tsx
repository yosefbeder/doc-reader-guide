"use client";

import React, { useState } from "react";

import { Icon } from "./icons";
import FormItem from "./FormItem";

interface TextAreaProps extends React.ComponentProps<"textarea"> {
  label: string | React.ReactNode;
  icon: Icon;
}

export default function TextArea({
  label,
  icon,
  id,
  className,
  onFocus,
  onBlur,
  disabled,
  ...props
}: TextAreaProps) {
  const [focus, setFocus] = useState(false);

  return (
    <FormItem
      label={label}
      icon={icon}
      focus={focus}
      id={id}
      className={className}
      disabled={disabled}
    >
      <textarea
        id={id}
        className="grow disabled:pointer-events-none focus:outline-none"
        onFocus={(e) => {
          setFocus(true);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          if (onBlur) onBlur(e);
        }}
        disabled={disabled}
        {...props}
      />
    </FormItem>
  );
}
