"use client";

import React from "react";
import Button from "./Button";
import { useFormStatus } from "react-dom";

export default function ButtonSubmit({
  type: _type,
  disabled: _disabled,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? "تحميل..." : children}
    </Button>
  );
}
