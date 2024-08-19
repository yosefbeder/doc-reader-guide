import getLectureLink from "@/utils/getLectureLink";
import UpdateLinkForm from "../../components/UpdateLinkForm";
import getUser from "@/utils/getUser";
import getModules from "@/utils/getModules";
import getSubjects from "@/utils/getSubjects";
import getLectures from "@/utils/getLectures";

export default async function LectureLinkUpdatePage({
  params: { linkId },
}: {
  params: { linkId: string };
}) {
  const { yearId } = await getUser();
  const modules = await getModules(yearId);
  const subjects = (
    await Promise.all(
      modules.map(async (myModule) => await getSubjects(yearId, myModule.id))
    )
  ).flat();
  const lectures = (
    await Promise.all(
      subjects.map(async (subject) => await getLectures(subject.id))
    )
  ).flat();
  const link = await getLectureLink(+linkId);
  return (
    <main className="main">
      <h2 className="mb-4">تعديل مصدر المحاضرة {link.id}</h2>
      <UpdateLinkForm
        id={link.lectureId}
        place="lectures"
        selectOptions={lectures}
        link={link}
      />
    </main>
  );
}
