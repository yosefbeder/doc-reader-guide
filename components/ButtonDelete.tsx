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
        const input = prompt(`برجاء كتابة ${confirmationText} للتأكيد`);

        if (input !== confirmationText) {
          alert("لم يتم الحذف");
          return;
        }

        formRef.current!.requestSubmit();
      }}
      {...props}
    >
      حذف
    </ButtonSubmit>
  );
}
