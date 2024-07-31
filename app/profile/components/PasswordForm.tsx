"use client";

import { useFormState } from "react-dom";

import { updatePassword } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default function PasswordForm(user: any) {
  const [fromState, formAction] = useFormState(updatePassword, {});

  return (
    <>
      {fromState?.message && <p>{fromState.message}</p>}
      <form action={formAction}>
        <label htmlFor="current-password">كلمة المرور الحالية</label>
        <input type="password" name="current-password" id="current-password" />
        <label htmlFor="new-password">كلمة المرور الجديدة</label>
        <input type="password" name="new-password" id="new-password" />
        <label htmlFor="confirmation-password">تأكيد كلمة المرور الجديدة</label>
        <input
          type="password"
          name="confirmation-password"
          id="confirmation-password"
        />
        <SubmitButton>تعديل</SubmitButton>
      </form>
    </>
  );
}
