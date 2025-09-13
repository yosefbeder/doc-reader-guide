"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import ButtonSubmit from "@/components/ButtonSubmit";
import { importSources } from "@/lib/actions/lectures";
import Message from "@/components/Message";

export default function ImportSourcesForm({
  lectureId,
}: {
  lectureId: number;
}) {
  const [input, setInput] = useState("");
  const [formState, formAction] = useFormState(importSources, {});

  return (
    <form action={formAction} className="col floating p-2">
      <input type="hidden" name="lecture-id" value={lectureId} />
      <div>
        <label className="block mb-2" htmlFor="data">
          JSON
        </label>
        <textarea
          className="block"
          id="data"
          name="data"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      {formState.message && formState.type && (
        <Message type={formState.type}>{formState.message}</Message>
      )}
      <ButtonSubmit disabled={!input.trim()} className="self-start">
        Import
      </ButtonSubmit>
    </form>
  );
}
