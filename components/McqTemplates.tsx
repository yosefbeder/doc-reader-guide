"use client";

import React, { useState } from "react";

import Button from "@/components/Button";
import Select from "./Select";

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

const MCQ_FILE = `I will send you a list of questions as a PDF file or text and I want you to turn it into a JSON of the following schema:
{
  text: content of question,
  options: array of options as strings (remove "a)" from each) with the same sequence in the file,
  correctOptionIndex: the index of the correct answer in \`options\` (solve it yourself)
}
Remove all extra spaces to minimize the size of the resulting file. Tell me how many questions where added.`;
const AI_GENERATED = `I will send you a PDF file or text and I want you to generate questions from it and export them into a JSON of the following schema:
{
  text: content of question,
  options: array of options as strings (remove "a)" from each) with the same sequence in the file,
  correctOptionIndex: the index of the correct answer in \`options\` (solve it yourself)
}
Remove all extra spaces to minimize the size of the resulting file. Tell me how many questions where added.`;

export default function McqTemplates() {
  const [model, setModel] = useState(models[0].value);

  return (
    <div className="col">
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
      <div className="flex flex-col items-start gap-2">
        <a href={model + MCQ_FILE} target="_blank">
          <Button color="white">MCQ file (AI answers)</Button>
        </a>
        <a href={model + AI_GENERATED} target="_blank">
          <Button color="white">AI generated</Button>
        </a>
      </div>
    </div>
  );
}
