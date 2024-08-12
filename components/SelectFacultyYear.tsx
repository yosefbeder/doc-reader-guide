"use client";

import React, { useEffect, useState } from "react";

import Select from "./Select";
import { Faculty, Year } from "@/types";
import { API_URL } from "@/constants";

async function getYears(facultyId: number): Promise<Year[]> {
  const res = await fetch(`${API_URL}/faculties/${facultyId}/years`);
  if (!res.ok) throw new Error();
  const json = await res.json();
  return json.data;
}

async function getFaculties(): Promise<Faculty[]> {
  const res = await fetch(`${API_URL}/faculties`);
  if (!res.ok) throw new Error();
  const json = await res.json();
  return await Promise.all(
    json.data.map(async (faculty: any) => ({
      ...faculty,
      years: await getYears(faculty.id),
    }))
  );
}

interface SelectFacultyYear {
  fetching: boolean;
  setFetching: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues?: {
    facultyId: number;
    yearId: number;
  };
}

export default function SelectFacultyYear({
  fetching,
  setFetching,
  defaultValues,
}: SelectFacultyYear) {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [facultyId, setFacultyId] = useState<number>();
  const [years, setYears] = useState<Year[]>([]);
  const [yearId, setYearId] = useState<number>();

  useEffect(() => {
    (async () => {
      const newFaculties = await getFaculties();
      setFaculties(newFaculties);
      setFetching(false);
      const newFacultyId = defaultValues?.facultyId || newFaculties[0].id;
      setFacultyId(newFacultyId);
      const newYears = newFaculties.find(
        ({ id }) => id === newFacultyId
      )!.years;
      setYears(newYears);
      setYearId(defaultValues?.yearId || newYears[0].id);
    })();
  }, []);

  return (
    <>
      <Select
        label="الكلية"
        icon="building-library"
        options={faculties.map(({ id, name, city }) => ({
          label: name.concat(" ", city).trim(),
          value: id,
        }))}
        value={facultyId}
        onChange={(e) => {
          const newFacultyId = +e.target.value;
          setFacultyId(newFacultyId);
          const newYears = faculties.find(
            ({ id }) => id === newFacultyId
          )!.years;
          setYears(newYears);
          setYearId(newYears[0].id);
        }}
        name="facultyId"
        id="facultyId"
        required
        className="mb-4"
        disabled={fetching}
      />
      <Select
        label="السنة الدراسية"
        icon="calendar"
        options={years.map(({ id, title }) => ({ label: title, value: id }))}
        value={yearId}
        onChange={(e) => setYearId(+e.target.value)}
        name="yearId"
        id="yearId"
        required
        className="mb-4"
        disabled={fetching}
      />
    </>
  );
}
