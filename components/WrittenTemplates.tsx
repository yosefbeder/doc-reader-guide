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

const WRITTEN_FILE = `You are an AI assistant tasked with converting a set of pre-existing medical questions (provided as input, e.g., from exam papers or notes) into a grouped JSON format. Group questions by type (e.g., Define, Enumerate, Give reason, Compare, Explain, Mention, Case).

**Instructions:**

1. Analyze the provided questions.
2. Categorize them into supported types: **Define, Case, Mention, Enumerate, Give reason, Compare, Explain**. Ignore unsupported types.
3. For each type, create **one object** in the output array with the following schema:

   \`\`\`json
   {
     "subQuestions": $group,
     "tapes": [],
     "masks": []
   }
   \`\`\`

   * $group is an array of { "text": string, "answer": string }.
4. In each object's "subQuestions" array:

   * Include objects with "text" (the question string) and "answer" (in HTML format, e.g., <ol> for lists, <table> for comparisons, <p> for text).
   * If answers are not provided, generate accurate ones based on medical knowledge.
   * Prefix the first "text" with the type in brackets, e.g., "[Enumerate] Two effects...". Do not repeat the prefix in subsequent questions.
   * Phrase questions directly without introductory verbs (e.g., "[Enumerate] Two effects of incompatible blood transfusion.", "[Give reason] Eosinophils kill parasites.").
5. Use user-specified types if given (e.g., "Include: Case, Enumerate; Ignore: Compare"). Default to all types.
6. Aim for all relevant questions per type; return [] if none.
7. Output strictly as JSON array of objects, each with the schema above.
8. Include the full answer provided in the file even if it exceeds the asked number (e.g., if an enumerate question asked about two but the file included more).

**Schema:**

\`\`\`json
[
  {
    "subQuestions": [
      {
        "text": "Question text",
        "answer": "HTML-formatted answer"
      }
    ],
    "tapes": [],
    "masks": []
  }
]
\`\`\`

**Example Output (for Enumerate):**

\`\`\`json
[
  {
    "subQuestions": [
      {
        "text": "[Enumerate] Two effects of incompatible blood transfusion.",
        "answer": "<ol><li>Hemolysis</li><li>Shock</li></ol>"
      },
      {
        "text": "Two granules in hyalomere of platelets.",
        "answer": "<ol><li>Alpha granules</li><li>Dense granules</li></ol>"
      }
    ],
    "tapes": [],
    "masks": []
  }
]
\`\`\``;
const AI_GENERATED = `You are an AI assistant tasked with converting medical content from a provided file (e.g., PDF of notes, articles, or exam questions) into a grouped list of questions with answers, formatted in this JSON schema:

\`\`\`json
[
  {
    "subQuestions": [
      {
        "text": "A single question string based on the medical content",
        "answer": "The answer in HTML format (e.g., <ol> for lists, <table> for comparisons)"
      }
    ],
    "tapes": [],
    "masks": []
  }
]
\`\`\`

**Instructions:**

1. Read the provided medical content file.
2. Identify and extract key questions and answers from the content, focusing on topics like **blood, immunology, microbiology, viruses, bacteria, fungi**. If answers are not present, generate accurate ones based on medical knowledge.
3. Use only supported question types: **Define, Case, Mention, Enumerate, Give reason, Compare, Explain**.

   * If the user specifies types (e.g., "Include: Case, Enumerate; Ignore: Compare"), follow that.
   * If none specified, default to all types.
4. Group questions by type: each **object** in the array corresponds to one type.

   * Inside each object, "subQuestions" is an array of { text, answer }.
   * Prefix the **first question** in each group with the type in brackets, e.g., "[Enumerate] ...". Do not repeat the prefix in subsequent questions within the same group.
   * Phrase questions concisely and directly, avoiding synonyms for the types (e.g., no “List” for Enumerate, no “Why” for Give reason).
5. Format answers in **HTML**:

   * <ol><li>...</li></ol> for enumerations.
   * <table><tr><th>Col1</th><th>Col2</th></tr><tr><td>Val1</td><td>Val2</td></tr></table> for comparisons.
   * <p>...</p> for definitions, cases, and explanations.
6. Aim for **3–5 questions per type** if the content allows; return [] if no suitable content.
7. Output strictly as a **JSON array of objects**, each following the schema above.
8. Keep the output as minimal as possible (like in the example).

**Example Output (for Enumerate type):**

\`\`\`json
[
  {
    "subQuestions": [
      {
        "text": "[Enumerate] Two effects of incompatible blood transfusion.",
        "answer": "<ol><li>Hemolysis</li><li>Shock</li></ol>"
      },
      {
        "text": "Two granules in hyalomere of platelets.",
        "answer": "<ol><li>Alpha granules</li><li>Dense granules</li></ol>"
      }
    ],
    "tapes": [],
    "masks": []
  }
]
\`\`\``;

export default function WrittenTemplates() {
  const [model, setModel] = useState(models[0].value);

  return (
    <div className="flex flex-col gap-4">
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
        <a href={model + WRITTEN_FILE} target="_blank">
          <Button color="white">Written file</Button>
        </a>
        <a href={model + AI_GENERATED} target="_blank">
          <Button color="white">AI generated</Button>
        </a>
      </div>
    </div>
  );
}
