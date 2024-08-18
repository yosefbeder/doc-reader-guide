import getFinalRevisionLink from "@/utils/getFinalRevisionLink";
import getLecture from "@/utils/getLecture";
import UpdateLinkForm from "../../components/UpdateLinkForm";

export default async function PracticalLinkUpdatePage({
  params: { linkId },
}: {
  params: { linkId: string };
}) {
  const link = await getFinalRevisionLink(+linkId);
  const lecture = await getLecture(+link.lectureId);
  return (
    <main className="main">
      <UpdateLinkForm id={lecture.subjectId} place="practical" link={link} />
    </main>
  );
}
