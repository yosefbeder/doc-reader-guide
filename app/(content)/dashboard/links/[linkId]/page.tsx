import getLink from "@/utils/getLink";
import getUser from "@/utils/getUser";
import getAllLectures from "@/utils/getAllLectures";

import UpdateLinkForm from "../components/UpdateLinkForm";

export default async function LectureLinkUpdatePage({
  params: { linkId },
}: {
  params: { linkId: string };
}) {
  return <main className="main">🧑‍💻: تحت الصيانة...</main>;
  const { yearId } = await getUser();
  const lectures = await getAllLectures(yearId);
  const link = await getLink(+linkId);
  return (
    <main className="main">
      <h2 className="mb-4">تعديل مصدر المحاضرة {link.id}</h2>
      <UpdateLinkForm lectures={lectures} link={link} />
    </main>
  );
}
