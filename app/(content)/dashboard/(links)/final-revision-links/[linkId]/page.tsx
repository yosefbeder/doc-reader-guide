import getFinalRevisionLink from "@/utils/getFinalRevisionLink";
import UpdateLinkForm from "../../components/UpdateLinkForm";
import getLecture from "@/utils/getLecture";

export default async function FinalRevisionLinkUpdatePage({
  params: { linkId },
}: {
  params: { linkId: string };
}) {
  const link = await getFinalRevisionLink(+linkId);
  const lecture = await getLecture(+link.lectureId);
  return (
    <main className="main">
      <UpdateLinkForm
        id={lecture.subjectId}
        place="final-revision"
        link={link}
      />
    </main>
  );
}
