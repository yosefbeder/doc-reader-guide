import { Faculty } from "@/types";

export default function getFaculty(
  faculties: Faculty[],
  facultyId: number
): Faculty {
  return faculties.find((faculty) => faculty.id === facultyId)!;
}
