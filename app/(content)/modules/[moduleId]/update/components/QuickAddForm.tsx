"use client";

import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import { quickAdd } from "@/lib/actions/subjects";
import Message from "@/components/Message";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { Subject } from "@/types";

const models = [
  {
    label: "ChatGPT",
    value: "https://chat.openai.com/?model=gpt-4&q=",
  },
  {
    label: "Grok",
    value: "https://grok.com/?q=",
  },
  {
    label: "Claude",
    value: "https://claude.ai/new/?q=",
  },
];

const TABLE_FILE = `I will send you a PDF containing a timetable for a medicine module. Please convert it into a JSON array of Subject objects following this interface:

\`\`\`typescript
interface Subject {
  name: 'Anatomy' | 'Physiology' | 'Histology' | 'Biochemistry' | 'Pathology' | 'Pharmacology' | 'Microbiology' | 'Parasitology';
  icon: string; // Use the URL strictly as per the subject name below
  lectures: Lecture[];
}

interface Lecture {
  title: string;
  date: string; // Use ISO 8601 date format (YYYY-MM-DD)
}
\`\`\`

Only include these subjects with their exact names and corresponding icon URLs:
- Anatomy: https://healthicons.org/icons/svg/outline/body/skeleton.svg
- Physiology: https://healthicons.org/icons/svg/outline/exercise/running.svg
- Histology: https://healthicons.org/icons/svg/outline/devices/microscope.svg
- Biochemistry: https://healthicons.org/icons/svg/outline/devices/test-tubes.svg
- Pathology: https://healthicons.org/icons/svg/outline/conditions/viral-lung_infection.svg
- Pharmacology: https://healthicons.org/icons/svg/outline/symbols/pharmacy.svg
- Microbiology: https://healthicons.org/icons/svg/outline/body/bacteria.svg
- Parasitology: https://healthicons.org/icons/svg/outline/zoonoses/mosquito.svg

Ignore any additional information outside these properties. If a subject has no lectures, omit it from the array. Please return only the JSON output without explanations or extra text.`;

export default function QuickAddForm(props: {
  moduleId: number;
  subjects: Subject[];
  disabled?: boolean;
}) {
  const { moduleId, subjects: presentSubjects = [], disabled } = props;
  const [formState, formAction] = useFormState(quickAdd, {});
  const [subjects, setQuestions] = useState("");
  const [model, setModel] = useState(models[0].value);

  // Encode present subjects for server
  const encodedSubjects = React.useMemo(
    () => JSON.stringify(presentSubjects.map(({ id, name }) => ({ id, name }))),
    [presentSubjects]
  );

  useEffect(() => {
    if (formState.resetKey) setQuestions("");
  }, [formState.resetKey]);
  return (
    <form action={formAction} className="col">
      <h3>QUICK ADD</h3>
      <input
        type="number"
        name="module-id"
        id="module-id"
        defaultValue={moduleId}
        className="hidden"
      />
      {/* Pass present subjects as hidden input */}
      <input type="hidden" name="present-subjects" value={encodedSubjects} />
      <Select
        label="AI model"
        icon="chat-bubble-left-ellipsis"
        options={models}
        value={model}
        onChange={(e) => setModel(e.target.value)}
        name="facultyId"
        id="facultyId"
        required
      />
      <a href={model + TABLE_FILE} target="_blank">
        <Button type="button" color="white">
          Table file
        </Button>
      </a>
      <label htmlFor="subjects" className="block">
        JSON
      </label>
      <textarea
        name="subjects"
        id="subjects"
        className="block"
        value={subjects}
        onChange={(e) => setQuestions(e.target.value)}
      ></textarea>
      {formState.message && formState.type && (
        <Message type={formState.type}>{formState.message}</Message>
      )}
      <ButtonSubmit disabled={disabled} className="self-start">
        Add
      </ButtonSubmit>
    </form>
  );
}
