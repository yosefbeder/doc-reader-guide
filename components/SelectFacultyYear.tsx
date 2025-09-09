import getFaculty from "@/utils/getFaculty";
import Select from "./Select";
import { Faculty } from "@/types";

interface SelectFacultyYearProps {
  faculties: Faculty[];
  facultyId: number;
  onFacultyChange: (id: number) => void;
  yearId: number;
  onYearChange: (id: number) => void;
}

export default function SelectFacultyYear({
  faculties,
  facultyId,
  onFacultyChange,
  yearId,
  onYearChange,
}: SelectFacultyYearProps) {
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
        onChange={(e) => onFacultyChange(+e.target.value)}
        name="facultyId"
        id="facultyId"
        required
      />
      <Select
        label="Year"
        icon="calendar-outline"
        options={getFaculty(faculties, facultyId).years.map(
          ({ title, id }) => ({
            label: title,
            value: id,
          })
        )}
        value={yearId}
        onChange={(e) => onYearChange(+e.target.value)}
        name="yearId"
        id="yearId"
        required
      />
    </>
  );
}
