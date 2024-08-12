"use client";

import { useFormStatus } from "react-dom";

import Button, { ButtonProps } from "./Button";

export default function ButtonSubmit({
  type: _type,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending || disabled ? "تحميل..." : children}
    </Button>
  );
}
