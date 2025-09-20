"use client";

import { useState } from "react";

import { Icon } from "./icons";
import FormItem from "./FormItem";

interface SelectProps extends React.ComponentProps<"select"> {
  label: string;
  icon: Icon;
  options: { label: string; value: number | string }[];
}

export default function Select({
  label,
  icon,
  options,
  id,
  className,
  disabled,
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
      disabled={disabled}
    >
      <select
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
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </FormItem>
  );
}
