"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import LinkFields, { LinkPlace } from "../../components/LinkFields";
import { addLink } from "@/lib/actions";
import Message from "@/components/Message";
import { useState } from "react";
import Select from "@/components/Select";

export default function AddLinkForm() {
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
      <LinkFields place={place} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>إضافة</ButtonSubmit>
    </form>
  );
}
