"use client";

import { useState } from "react";

import Select from "./Select";
import { Faculty } from "@/types";

interface SelectFacultyYear {
  faculties: Faculty[];
  defaultValues?: {
    facultyId: number;
    yearId: number;
  };
}

function getFaculty(faculties: Faculty[], facultyId: number): Faculty {
  return faculties.find((faculty) => faculty.id === facultyId)!;
}

export default function SelectFacultyYear({
  faculties,
  defaultValues,
}: SelectFacultyYear) {
  const [facultyId, setFacultyId] = useState(
    defaultValues?.facultyId || faculties[0].id
  );
  const [yearId, setYearId] = useState(
    defaultValues?.yearId || getFaculty(faculties, facultyId).years[0].id
  );

  return (
    <>
      <Select
        label="College"
        icon="building-library"
        options={faculties.map(({ id, name, city }) => ({
          label: name.concat(" ", city).trim(),
          value: id,
        }))}
        value={facultyId}
        onChange={(e) => {
          const newFacultyId = +e.target.value;
          setFacultyId(newFacultyId);
          setYearId(getFaculty(faculties, newFacultyId).years[0].id);
        }}
        name="facultyId"
        id="facultyId"
        required
        className="mb-4"
      />
      <Select
        label="Year"
        icon="calendar"
        options={getFaculty(faculties, facultyId).years.map(
          ({ title, id }) => ({
            label: title,
            value: id,
          })
        )}
        value={yearId}
        onChange={(e) => setYearId(+e.target.value)}
        name="yearId"
        id="yearId"
        required
        className="mb-4"
      />
    </>
  );
}
