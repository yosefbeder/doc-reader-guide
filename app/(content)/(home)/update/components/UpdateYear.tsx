"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import Message from "@/components/Message";
import Select from "@/components/Select";
import { updateYear } from "@/lib/actions/years";
import useUpdateForm from "@/lib/hooks/useUpdateForm";
import getPrefix from "@/utils/getPrefix";
import { User, Module } from "@/types";
import notUpdateable from "@/utils/isUpdateable";

export default function UpdateYear({
  user,
  modules,
}: {
  user: User;
  modules: Module[];
}) {
  const semesters = Array.from(
    new Set(modules.map(({ semesterName }) => semesterName))
  ).toSorted();
  const [currentSemester, setCurrentSemester] = useState(
    user.year.currentSemester || -1
  );
  const [formState, formAction] = useFormState(updateYear, {});
  const { hideMessage, setHideMessage } = useUpdateForm(formState);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4"
      onClick={() => setHideMessage(true)}
    >
      <input
        type="number"
        name="year-id"
        id="year-id"
        className="hidden"
        defaultValue={user.yearId || ""}
      />
      <Select
        icon="academic-cap"
        name="current-semester"
        label="Current semester"
        options={[
          ...semesters.map((semester) => ({
            label: `${semester}${getPrefix(semester)} Semester`,
            value: semester,
          })),
          { label: "None", value: -1 },
        ]}
        value={currentSemester}
        onChange={(e) => setCurrentSemester(Number(e.target.value))}
      />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type}>{formState.message}</Message>
      )}
      <ButtonSubmit
        disabled={user.roleId > 1}
        className="self-start"
        color="yellow"
      >
        Update
      </ButtonSubmit>
    </form>
  );
}
