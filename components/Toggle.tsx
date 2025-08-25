import React, { useState } from "react";

export interface ToggleProps
  extends Omit<React.ComponentProps<"button">, "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "cyan" | "yellow" | "rose" | "white";
  label: string;
}

export default function Toggle({
  checked: controlledChecked,
  onChange,
  color = "cyan",
  className,
  disabled,
  label,
  id,
  ...props
}: ToggleProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(false);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const handleToggle = () => {
    if (disabled) return;
    if (!isControlled) {
      setUncontrolledChecked(!checked);
    }
    onChange?.(!checked);
  };

  const colorVariants: Record<string, string> = {
    cyan: checked ? "bg-cyan-600 border-cyan-600" : "bg-white border-cyan-600",
    yellow: checked
      ? "bg-yellow-400 border-yellow-400"
      : "bg-white border-yellow-400",
    rose: checked ? "bg-rose-600 border-rose-600" : "bg-white border-rose-600",
    white: checked ? "bg-cyan-600 border-cyan-600" : "bg-white border-cyan-600",
  };

  const ballVariants: Record<string, string> = {
    cyan: checked ? "translate-x-5 bg-white" : "translate-x-0 bg-cyan-600",
    yellow: checked ? "translate-x-5 bg-white" : "translate-x-0 bg-yellow-400",
    rose: checked ? "translate-x-5 bg-white" : "translate-x-0 bg-rose-600",
    white: checked ? "translate-x-5 bg-white" : "translate-x-0 bg-cyan-600",
  };

  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <button
        type="button"
        id={id}
        onClick={handleToggle}
        disabled={disabled}
        className={`
        relative inline-flex h-6 w-11 items-center rounded-full border-2 
        transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
        ${colorVariants[color]} ${className}
        `}
        {...props}
      >
        <span
          className={`
          inline-block h-5 w-5 transform rounded-full border border-white 
          shadow transition-transform duration-200 ease-in-out ${ballVariants[color]}
          `}
        />
      </button>
      <p>{label}</p>
    </label>
  );
}
