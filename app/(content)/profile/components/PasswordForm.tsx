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
        label="Current password"
        name="current-password"
        id="current-password"
        required
        className="mb-4"
      />
      <InputPassword
        label="New password"
        name="new-password"
        id="new-password"
        required
        className="mb-4"
      />
      <InputPassword
        label="Confirm new password"
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
      <ButtonSubmit className="w-max px-4 mb-4">Update</ButtonSubmit>
    </form>
  );
}
