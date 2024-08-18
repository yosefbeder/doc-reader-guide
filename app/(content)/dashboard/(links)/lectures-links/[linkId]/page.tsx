import getLectureLink from "@/utils/getLectureLink";
import UpdateLinkForm from "../../components/UpdateLinkForm";

export default async function LectureLinkUpdatePage({
  params: { linkId },
}: {
  params: { linkId: string };
}) {
  const link = await getLectureLink(+linkId);
  return (
    <main className="main">
      <UpdateLinkForm id={link.lectureId} place="lectures" link={link} />
    </main>
  );
}
