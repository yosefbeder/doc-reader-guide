"use client";

import React, { useState } from "react";

import { Icon } from "./icons";
import FormItem from "./FormItem";

interface SelectProps extends React.ComponentProps<"select"> {
  label: string;
  icon: Icon;
  options: { label: string; value: number }[];
}

export default function Select({
  label,
  icon,
  options,
  id,
  className,
  onFocus,
  onBlur,
  ...props
}: SelectProps) {
  const [focus, setFocus] = useState(false);

  return (
    <FormItem
      label={label}
      icon={icon}
      focus={focus}
      id={id}
      className={className}
    >
      <select
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
      >
        {options.map(({ label, value }) => (
          <option value={value}>{label}</option>
        ))}
      </select>
    </FormItem>
  );
}
