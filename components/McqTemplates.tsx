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

const MCQ_FILE = `You will receive a list of questions either as a PDF file or plain text. For each question, convert it into a JSON object following this schema: { "text": "question content without extra spaces", "options": ["option1", "option2", ...], "correctOptionIndex": correct answer's zero-based index }. Remove any prefix such as 'a)', 'b)', etc., from options while preserving their original order. Determine the correct answer yourself. Strip all unnecessary whitespace to minimize the JSON size. Aggregate all questions into a single JSON array, preserving the original question sequence with no omissions. At the end, output the total number of questions processed. Do not include any LaTeX formatting.`;
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
