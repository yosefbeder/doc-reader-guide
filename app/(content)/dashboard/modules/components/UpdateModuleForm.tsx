"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import ModuleFields from "./ModuleFields";
import { Module } from "@/types";
import { updateModule } from "@/lib/actions";
import Message from "@/components/Message";

export default function UpdateModuleForm({
  myModule: { id, icon, name, semesterName, yearId },
}: {
  myModule: Module;
}) {
  const [formState, formAction] = useFormState(updateModule, {});

  return (
    <form action={formAction} className="max-w-lg">
      <ModuleFields
        yearId={yearId}
        defaultValues={{ id, icon, name, semesterName }}
      />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>تعديل</ButtonSubmit>
    </form>
  );
}
