"use client";

import { useMemo, useState } from "react";

import Input from "@/components/Input";
import Select from "@/components/Select";
import { Lecture } from "@/types";
import getUniqueObjectsById from "@/utils/getUniqueObjectsById";
import { getModuleIdSubjects } from "../../utils";

export default function LectureFields({
  lectures,
  defaultValues,
}: {
  lectures: Lecture[];
  defaultValues?: Lecture;
}) {
  const modules = useMemo(
    () =>
      getUniqueObjectsById(
        lectures.map(({ moduleId, moduleName }) => ({
          id: moduleId,
          name: moduleName,
        }))
      ),
    []
  );
  const [moduleId, setModuleId] = useState(
    defaultValues?.moduleId || modules[0].id
  );
  const subjects = useMemo(
    () =>
      getUniqueObjectsById(
        lectures.map(({ subjectId, subjectName, moduleId }) => ({
          id: subjectId,
          name: subjectName,
          moduleId,
        }))
      ),
    []
  );
  const [subjectId, setSubjectId] = useState(
    defaultValues?.subjectId || getModuleIdSubjects(subjects, moduleId)[0].id
  );

  return (
    <>
      {defaultValues && (
        <input
          name="lecture-id"
          id="lecture-id"
          className="hidden"
          defaultValue={defaultValues.id}
        />
      )}
      <Input
        label="العنوان"
        icon="book-open"
        type="text"
        name="title"
        id="title"
        defaultValue={defaultValues?.title}
        required
        className="mb-4"
      />
      <Select
        label="الموديول"
        icon="academic-cap"
        options={modules.map(({ id, name }) => ({
          label: name,
          value: id,
        }))}
        value={moduleId}
        onChange={(e) => {
          const nextModuleId = +e.target.value;
          setModuleId(nextModuleId);
          setSubjectId(getModuleIdSubjects(subjects, nextModuleId)[0].id);
        }}
        required
        className="mb-4"
      />
      <Select
        label="المادة"
        icon="academic-cap"
        name="subject-id"
        id="subject-id"
        options={getModuleIdSubjects(subjects, moduleId).map(
          ({ id, name }) => ({
            label: name,
            value: id,
          })
        )}
        value={subjectId}
        onChange={(e) => setSubjectId(+e.target.value)}
        required
        className="mb-4"
      />
      <Input
        label="التاريخ"
        icon="calendar"
        type="date"
        name="date"
        id="date"
        defaultValue={
          defaultValues &&
          new Date(defaultValues.date).toISOString().substring(0, 10)
        }
        required
        className="mb-4"
      />
    </>
  );
}
