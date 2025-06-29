"use client";

import { useFormState } from "react-dom";
import { useSWRConfig } from "swr";

import { updatePersonalInfo } from "@/lib/actions";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Faculty, User } from "@/types";
import Input from "@/components/Input";
import Message from "@/components/Message";
import SelectFacultyYear from "@/components/SelectFacultyYear";
import { useEffect } from "react";

export default function PersonalInfoForm({
  user,
  faculties,
}: {
  user: User;
  faculties: Faculty[];
}) {
  const [formState, formAction] = useFormState(updatePersonalInfo, {});
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (formState.type === "success") mutate(() => true, undefined);
  }, [formState]);

  return (
    <form action={formAction} className="max-w-lg">
      <Input
        label="Name"
        icon="user"
        type="text"
        name="name"
        id="name"
        required
        defaultValue={user.name}
        className="mb-4"
      />
      <Input
        label="Email"
        icon="envelope"
        type="email"
        name="email"
        id="email"
        required
        defaultValue={user.email}
        className="mb-4"
        disabled
      />
      <SelectFacultyYear
        faculties={faculties}
        defaultValues={{ facultyId: user.facultyId, yearId: user.yearId }}
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
