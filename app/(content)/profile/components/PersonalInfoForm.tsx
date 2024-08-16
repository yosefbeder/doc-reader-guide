"use client";

import { useState } from "react";
import { useFormState } from "react-dom";

import { updatePersonalInfo } from "@/lib/actions";
import ButtonSubmit from "@/components/ButtonSubmit";
import { User } from "@/types";
import Input from "@/components/Input";
import Message from "@/components/Message";
import SelectFacultyYear from "@/components/SelectFacultyYear";

export default function PersonalInfoForm({ user }: { user: User }) {
  const [formState, formAction] = useFormState(updatePersonalInfo, {});
  const [fetching, setFetching] = useState(true);

  return (
    <form action={formAction} className="max-w-lg">
      <Input
        label="اسم المستخدم"
        icon="user"
        type="text"
        name="name"
        id="name"
        required
        defaultValue={user.name}
        className="mb-4"
      />
      <Input
        label="البريد الإلكتروني"
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
        fetching={fetching}
        setFetching={setFetching}
        defaultValues={{ facultyId: user.facultyId, yearId: user.yearId }}
      />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit disabled={fetching} className="w-max px-4 mb-4">
        تعديل
      </ButtonSubmit>
    </form>
  );
}
