"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import ModuleFields from "./ModuleFields";
import { addModule } from "@/lib/actions";
import Message from "@/components/Message";

export default function AddModuleForm({ yearId }: { yearId: number }) {
  const [formState, formAction] = useFormState(addModule, {});

  return (
    <form action={formAction} className="max-w-lg mb-4">
      <ModuleFields yearId={yearId} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>إضافة</ButtonSubmit>
    </form>
  );
}
