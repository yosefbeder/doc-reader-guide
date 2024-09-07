import { Lecture } from "@/types";

interface ReducedSubject {
  id: number;
  name: string;
  moduleId: number;
}

export const getModuleIdSubjects = (
  subjects: ReducedSubject[],
  moduleId: number
) => subjects.filter((subject) => subject.moduleId === moduleId);

export const getSubjectIdLectures = (lectures: Lecture[], subjectId: number) =>
  lectures.filter((lecture) => lecture.subjectId === subjectId);
