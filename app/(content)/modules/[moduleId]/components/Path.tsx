import BasePath from "@/components/Path";
import { Module } from "@/types";
import getPrefix from "@/utils/getPrefix";

export default function Path({ myModule }: { myModule: Module }) {
  return (
    <BasePath>
      {myModule.semesterName}
      <sup>{getPrefix(myModule.semesterName)}</sup> Semester → {myModule.name}
    </BasePath>
  );
}
