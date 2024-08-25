"use client";

import { RefObject } from "react";

import ButtonSubmit from "./ButtonSubmit";

export default function ButtonDelete({
  confirmationText,
  formRef,
}: {
  confirmationText: string;
  formRef: RefObject<HTMLFormElement>;
}) {
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
    >
      حذف
    </ButtonSubmit>
  );
}
