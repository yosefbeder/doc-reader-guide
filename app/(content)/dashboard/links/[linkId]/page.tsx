import getLink from "@/utils/getLink";
import UpdateLinkForm from "../components/UpdateLinkForm";
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
      modules.map(async (myModule) =>
        (
          await getSubjects(yearId, myModule.id)
        ).map((subject) => ({ ...subject, myModule }))
      )
    )
  ).flat();
  const lectures = (
    await Promise.all(
      subjects.map(async (subject) =>
        (
          await getLectures(subject.id)
        ).map((lecture) => ({ ...lecture, subject }))
      )
    )
  ).flat();
  const link = await getLink(+linkId);
  return (
    <main className="main">
      <h2 className="mb-4">تعديل مصدر المحاضرة {link.id}</h2>
      <UpdateLinkForm lectures={lectures} link={link} />
    </main>
  );
}
