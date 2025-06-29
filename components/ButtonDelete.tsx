"use client";

import { RefObject } from "react";

import { ButtonProps } from "./Button";
import ButtonSubmit from "./ButtonSubmit";

export default function ButtonDelete({
  confirmationText,
  formRef,
  ...props
}: {
  confirmationText: string;
  formRef: RefObject<HTMLFormElement>;
} & ButtonProps) {
  return (
    <ButtonSubmit
      color="rose"
      onClick={(e) => {
        e.preventDefault();
        const input = prompt(`Enter ${confirmationText} to confirm deletion`);

        if (input !== confirmationText) {
          alert("Deletion cancelled");
          return;
        }

        formRef.current!.requestSubmit();
      }}
      {...props}
    >
      Delete
    </ButtonSubmit>
  );
}
