"use client";

import { useFormState } from "react-dom";

import ModuleFields from "./ModuleFields";
import { addModule } from "@/lib/actions";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";

export default function AddModuleForm({ yearId }: { yearId: number }) {
  const [formState, formAction] = useFormState(addModule, {});

  return (
    <form action={formAction}>
      <ModuleFields yearId={yearId} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
