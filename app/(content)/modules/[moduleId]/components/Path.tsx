import BasePath from "@/components/Path";
import getModule from "@/utils/getModule";
import getPrefix from "@/utils/getPrefix";

export default async function Path({
  yearId,
  moduleId,
}: {
  yearId: number;
  moduleId: number;
}) {
  const myModule = await getModule(yearId, moduleId);

  return (
    <BasePath>
      {myModule.semesterName}
      <sup>{getPrefix(myModule.semesterName)}</sup> Semester → {myModule.name}
    </BasePath>
  );
}
