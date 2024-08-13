"use client";

import { useFormState } from "react-dom";

import { updatePassword } from "@/lib/actions";
import ButtonSubmit from "@/components/ButtonSubmit";
import Input from "@/components/Input";
import Message from "@/components/Message";

export default function PasswordForm(user: any) {
  const [formState, formAction] = useFormState(updatePassword, {});

  return (
    <form action={formAction} className="max-w-lg">
      <Input
        label="كلمة المرور الحالية"
        icon="eye-slash"
        type="password"
        name="current-password"
        id="current-password"
        required
        className="mb-4"
      />
      <Input
        label="كلمة المرور الجديدة"
        icon="eye-slash"
        type="password"
        name="new-password"
        id="new-password"
        required
        className="mb-4"
      />
      <Input
        label="تأكيد كلمة المرور الجديدة"
        icon="eye-slash"
        type="password"
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
