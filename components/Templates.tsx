import React from "react";
import Button from "@/components/Button";

const AI_MODEL_URL = "https://chat.openai.com/?model=gpt-4&q=";
const MCQ_FILE_NO_ANSWERS = `I will send you a list of questions as a PDF file or text and I want you to turn it into a JSON of the following schema:
{
  text: content of question,
  options: array of options as strings (remove "a)" from each) with the same sequence in the file,
  correctOptionIndex: always 0
}
Remove all extra spaces to minimize the size of the resulting file. Tell me how many questions where added.`;
const MCQ_FILE_AI_ANSWERS = `I will send you a list of questions as a PDF file or text and I want you to turn it into a JSON of the following schema:
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

export default function Templates() {
  return (
    <div className="flex gap-2">
      <a
        href={AI_MODEL_URL + MCQ_FILE_NO_ANSWERS}
        target="_blank"
        className="reset-link"
      >
        <Button color="white">MCQ file (no answers)</Button>
      </a>
      <a
        href={AI_MODEL_URL + MCQ_FILE_AI_ANSWERS}
        target="_blank"
        className="reset-link"
      >
        <Button color="white">MCQ file (AI answers)</Button>
      </a>
      <a
        href={AI_MODEL_URL + AI_GENERATED}
        target="_blank"
        className="reset-link"
      >
        <Button color="white">AI generated</Button>
      </a>
    </div>
  );
}
