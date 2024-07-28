"use client";

import { useFormState } from "react-dom";

import { updatePassword } from "@/lib/actions";

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
        <button type="submit">تعديل</button>
      </form>
    </>
  );
}
