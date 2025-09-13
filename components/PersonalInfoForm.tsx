"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useSWRConfig } from "swr";

import { updatePersonalInfo } from "@/lib/actions/users";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Action, Faculty, Resource, User } from "@/types";
import Message from "@/components/Message";
import SelectFacultyYear from "@/components/SelectFacultyYear";
import { logEvent } from "@/lib/event-logger";
import getFaculty from "@/utils/getFaculty";

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
  const [facultyId, setFacultyId] = useState(user.facultyId || faculties[0].id);
  const [yearId, setYearId] = useState(
    user.yearId || getFaculty(faculties, facultyId).years[0].id
  );

  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (formState.type === "success") {
      mutate(() => true, undefined);
      localStorage.removeItem("select-class");
      logEvent(Resource.USER, user.id, Action.UPDATE, {
        yearId,
      });
      location.reload();
    }
  }, [formState]);

  return (
    <form action={formAction} className="max-w-xl w-full col">
      <SelectFacultyYear
        faculties={faculties}
        facultyId={facultyId}
        onFacultyChange={(id) => {
          setFacultyId(id);
          setYearId(getFaculty(faculties, id).years[0].id);
        }}
        yearId={yearId}
        onYearChange={(id) => setYearId(id)}
      />
      {formState.message && formState.type && (
        <Message type={formState.type}>{formState.message}</Message>
      )}
      <ButtonSubmit className="self-start">{buttonLabel}</ButtonSubmit>
    </form>
  );
}
