"use client";

import { useFormStatus } from "react-dom";

import Button, { ButtonProps } from "./Button";

export default function ButtonSubmit(props: ButtonProps) {
  const { pending } = useFormStatus();
  return <Button type="submit" isLoading={pending} {...props} />;
}
