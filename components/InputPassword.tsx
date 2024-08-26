import { HTMLInputTypeAttribute, useState } from "react";
import { FormItemNoIcon } from "./FormItem";
import { icons } from "./icons";

interface InputPasswordProps extends React.ComponentProps<"input"> {
  label: string;
}

export default function InputPassword({
  type: _type,
  label,
  id,
  className,
  onFocus,
  onBlur,
  disabled,
  ...props
}: InputPasswordProps) {
  const [focus, setFocus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormItemNoIcon
      label={label}
      focus={focus}
      id={id}
      className={className}
      disabled={disabled}
    >
      <button
        type="button"
        className="rounded-full p-2 hover:bg-slate-50 active:bg-slate-100"
        onClick={() => setIsVisible((prev) => !prev)}
      >
        {icons[isVisible ? "eye-slash" : "eye"]}
      </button>
      <input
        id={id}
        type={isVisible ? "text" : "password"}
        className="grow disabled:pointer-events-none focus:outline-none disabled:bg-transparent"
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
    </FormItemNoIcon>
  );
}
