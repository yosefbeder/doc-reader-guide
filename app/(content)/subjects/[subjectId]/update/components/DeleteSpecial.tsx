"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import { Lecture } from "@/types";
import ButtonDelete from "@/components/ButtonDelete";
import { deleteLecture } from "@/lib/actions";

export default function DeleteSpecial({ lectures }: { lectures: Lecture[] }) {
  const pdfr = useRef<HTMLFormElement>(null);
  const frdfr = useRef<HTMLFormElement>(null);
  const [_p, pdfa] = useFormState(deleteLecture, {});
  const [_fr, frdfa] = useFormState(deleteLecture, {});

  return (
    <>
      <h2 className="mb-4">DANGER ZONE</h2>
      <ul className="flex flex-col gap-4">
        {lectures.map((lecture) => (
          <li key={lecture.id}>
            {(() => {
              if (lecture.type === "Practical") {
                return (
                  <form ref={pdfr} action={pdfa}>
                    <input
                      type="number"
                      name="lecture-id"
                      id="lecture-id"
                      className="hidden"
                      defaultValue={lecture.id}
                    />
                    <ButtonDelete
                      customLabel="Delete practical"
                      formRef={pdfr}
                      confirmationText={`PRACTICAL ${lecture.id}`}
                    />
                  </form>
                );
              } else {
                return (
                  <form ref={frdfr} action={frdfa}>
                    <input
                      type="number"
                      name="lecture-id"
                      id="lecture-id"
                      className="hidden"
                      defaultValue={lecture.id}
                    />
                    <ButtonDelete
                      customLabel="Delete final revision"
                      formRef={frdfr}
                      confirmationText={`FINAL REVISION ${lecture.id}`}
                    />
                  </form>
                );
              }
            })()}
          </li>
        ))}
      </ul>
    </>
  );
}
