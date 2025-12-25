"use client";

import React, { useEffect, useState } from "react";
import Dialogue from "@/components/Dialogue";
import Button from "@/components/Button";
import getFaculties from "@/utils/getFaculties";
import getModules from "@/utils/getModulesClient";
import { fetchSubjects } from "@/lib/actions/subjects";
import { fetchLectures } from "@/lib/actions/lectures";
import { Faculty, Module, Subject, Lecture } from "@/types";

export default function TransferDialogue({
  onClose,
  onTransfer,
  isTransferring,
}: {
  onClose: () => void;
  onTransfer: (targetLectureId: number) => void;
  isTransferring: boolean;
}) {
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  const [selectedFaculty, setSelectedFaculty] = useState<number>();
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedModule, setSelectedModule] = useState<number>();
  const [selectedSubject, setSelectedSubject] = useState<number>();
  const [selectedLecture, setSelectedLecture] = useState<number>();

  const [modules, setModules] = useState<Module[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);

  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingLectures, setLoadingLectures] = useState(false);

  useEffect(() => {
    setLoadingFaculties(true);
    getFaculties()
      .then(setFaculties)
      .finally(() => setLoadingFaculties(false));
  }, []);

  useEffect(() => {
    if (selectedYear) {
      setLoadingModules(true);
      getModules(selectedYear)
        .then(setModules)
        .finally(() => setLoadingModules(false));
    } else {
      setModules([]);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedModule) {
      setLoadingSubjects(true);
      fetchSubjects(selectedModule)
        .then(setSubjects)
        .finally(() => setLoadingSubjects(false));
    } else {
      setSubjects([]);
    }
  }, [selectedModule]);

  useEffect(() => {
    if (selectedSubject) {
      setLoadingLectures(true);
      fetchLectures(selectedSubject)
        .then(setLectures)
        .finally(() => setLoadingLectures(false));
    } else {
      setLectures([]);
    }
  }, [selectedSubject]);

  return (
    <Dialogue
      header="Transfer Sources"
      onClose={onClose}
      className="w-full max-w-lg rounded-xl"
    >
      <div className="flex flex-col gap-4">
        {/* Faculty & Year */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Faculty & Year</label>
          <select
            className="input"
            onChange={(e) => {
              const [fId, yId] = e.target.value.split("-").map(Number);
              setSelectedFaculty(fId);
              setSelectedYear(yId);
              setSelectedModule(undefined);
              setSelectedSubject(undefined);
              setSelectedLecture(undefined);
            }}
            value={
              selectedFaculty && selectedYear
                ? `${selectedFaculty}-${selectedYear}`
                : ""
            }
            disabled={loadingFaculties}
          >
            <option value="">Select Faculty & Year</option>
            {faculties.map((f) => (
              <optgroup key={f.id} label={f.name + " " + f.city}>
                {f.years.map((y) => (
                  <option key={y.id} value={`${f.id}-${y.id}`}>
                    {y.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Module */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Module</label>
          <select
            className="input"
            onChange={(e) => {
              setSelectedModule(Number(e.target.value));
              setSelectedSubject(undefined);
              setSelectedLecture(undefined);
            }}
            value={selectedModule || ""}
            disabled={!selectedYear || loadingModules}
          >
            <option value="">Select Module</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Subject</label>
          <select
            className="input"
            onChange={(e) => {
              setSelectedSubject(Number(e.target.value));
              setSelectedLecture(undefined);
            }}
            value={selectedSubject || ""}
            disabled={!selectedModule || loadingSubjects}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lecture */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Lecture</label>
          <select
            className="input"
            onChange={(e) => setSelectedLecture(Number(e.target.value))}
            value={selectedLecture || ""}
            disabled={!selectedSubject || loadingLectures}
          >
            <option value="">Select Lecture</option>
            {lectures.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} disabled={isTransferring}>
            Cancel
          </Button>
          <Button
            onClick={() => selectedLecture && onTransfer(selectedLecture)}
            disabled={!selectedLecture || isTransferring}
            isLoading={isTransferring}
          >
            Transfer
          </Button>
        </div>
      </div>
    </Dialogue>
  );
}
