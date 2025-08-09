"use client";

import { useFormState } from "react-dom";

import ModuleFields from "./ModuleFields";
import { addModule } from "@/lib/actions/modules";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import { useAddForm } from "@/lib/hooks";

export default function AddModuleForm({ yearId }: { yearId: number }) {
  const [formState, formAction] = useFormState(addModule, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form action={formAction} onClickCapture={() => setHideMessage(true)}>
      <ModuleFields key={formKey} yearId={yearId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
