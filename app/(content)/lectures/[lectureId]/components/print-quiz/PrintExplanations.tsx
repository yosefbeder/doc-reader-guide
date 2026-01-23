"use client";

import React from "react";
import isValidURL from "@/utils/isValidURL";

export default function PrintExplanations({
  explanations,
}: {
  explanations: { index: number; explanation: string }[];
}) {
  if (!explanations || explanations.length === 0) return null;

  return (
    <>
      <h2 className="my-4">Explanations</h2>
      <ul>
        {explanations.map(({ index, explanation }) => (
          <li key={`explanation-${index}`}>
            {index + 1}.{" "}
            {isValidURL(explanation!) ? (
              <a className="link" href={explanation} target="_blank">
                {explanation}
              </a>
            ) : (
              explanation
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
