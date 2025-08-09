"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useSWRConfig } from "swr";

import { updatePersonalInfo } from "@/lib/actions/auth";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Faculty, User } from "@/types";
import Message from "@/components/Message";
import SelectFacultyYear from "@/components/SelectFacultyYear";

export default function PersonalInfoForm({
  user,
  faculties,
  buttonLabel,
}: {
  user: User;
  faculties: Faculty[];
  buttonLabel: string;
}) {
  const [formState, formAction] = useFormState(updatePersonalInfo, {});
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (formState.type === "success") {
      mutate(() => true, undefined);
      localStorage.removeItem("select-class");
    }
  }, [formState]);

  return (
    <form action={formAction} className="max-w-lg flex flex-col gap-4">
      <SelectFacultyYear
        faculties={faculties}
        defaultValues={
          user.facultyId && user.yearId
            ? { facultyId: user.facultyId, yearId: user.yearId }
            : undefined
        }
      />
      {formState.message && formState.type && (
        <Message type={formState.type}>{formState.message}</Message>
      )}
      <ButtonSubmit className="w-max px-4">{buttonLabel}</ButtonSubmit>
    </form>
  );
}
