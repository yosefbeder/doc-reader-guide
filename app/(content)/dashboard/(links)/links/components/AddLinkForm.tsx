"use client";

import { useState } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import LinkFields, { LinkPlace } from "../../components/LinkFields";
import { addLink } from "@/lib/actions";
import Message from "@/components/Message";
import Select from "@/components/Select";
import { Lecture, Subject } from "@/types";

export default function AddLinkForm({
  lectures,
  subjects,
}: {
  lectures: Lecture[];
  subjects: Subject[];
}) {
  const [formState, formAction] = useFormState(addLink, {});
  const [place, setPlace] = useState<LinkPlace>("lectures");

  return (
    <form action={formAction} className="max-w-lg mb-4">
      <Select
        label="المكان"
        icon="map"
        id="place"
        name="place"
        options={[
          { label: "المحاضرات", value: "lectures" },
          { label: "العملي", value: "practical" },
          { label: "المراجعة النهائية", value: "final-revision" },
        ]}
        value={place}
        onChange={(e) => setPlace(e.target.value as LinkPlace)}
        className="mb-4"
      />
      <LinkFields
        place={place}
        selectOptions={place === "lectures" ? lectures : subjects}
      />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>إضافة</ButtonSubmit>
    </form>
  );
}
