"use client";

import { useFormState } from "react-dom";

import { updatePassword } from "@/lib/actions";
import ButtonSubmit from "@/components/ButtonSubmit";
import Input from "@/components/Input";
import Message from "@/components/Message";
import InputPassword from "@/components/InputPassword";

export default function PasswordForm(user: any) {
  const [formState, formAction] = useFormState(updatePassword, {});

  return (
    <form action={formAction} className="max-w-lg">
      <InputPassword
        label="كلمة المرور الحالية"
        name="current-password"
        id="current-password"
        required
        className="mb-4"
      />
      <InputPassword
        label="كلمة المرور الجديدة"
        name="new-password"
        id="new-password"
        required
        className="mb-4"
      />
      <InputPassword
        label="تأكيد كلمة المرور الجديدة"
        name="confirmation-password"
        id="confirmation-password"
        required
        className="mb-4"
      />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit className="w-max px-4 mb-4">تعديل</ButtonSubmit>
    </form>
  );
}
