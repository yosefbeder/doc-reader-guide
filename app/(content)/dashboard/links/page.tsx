import Link from "next/link";

import getLectures from "@/utils/getLectures";
import getModules from "@/utils/getModules";
import getSubjects from "@/utils/getSubjects";
import getUser from "@/utils/getUser";
import Button from "@/components/Button";
import { getLectureLinks } from "@/utils/getLecture";
import AddLinkForm from "./components/AddLinkForm";
import ButtonDeleteLink from "./components/ButtonDeleteLink";

export default async function LinksPage() {
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
  const lectureLinks = (
    await Promise.all(
      lectures.map(async (lecture) => await getLectureLinks(lecture.id))
    )
  ).flat();

  return (
    <main className="main">
      <h2 className="mb-4">إضافة مصدر</h2>
      <AddLinkForm lectures={lectures} />
      <h2 className="mb-4">عرض المصادر</h2>
      <div className="overflow-y-scroll mb-4">
        <table className="w-max">
          <thead>
            <tr>
              <th>الرقم التعريفي</th>
              <th>العنوان</th>
              <th>تحت العنوان</th>
              <th>الرابط</th>
              <th>النوع</th>
              <th>القسم</th>
              <th>المحاضرة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {lectureLinks.map(
              ({ id, title, subTitle, url, type, category, lectureId }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{title}</td>
                  <td>{subTitle}</td>
                  <td>{url}</td>
                  <td>{type}</td>
                  <td>{category}</td>
                  <td>
                    {(function () {
                      const { title, type, subject } = lectures.find(
                        (lecture) => lecture.id === lectureId
                      )!;
                      return type == "Normal"
                        ? title
                        : `${subject.myModule.name} → ${subject.name} → ${title}`;
                    })()}
                  </td>
                  <td>
                    <Link
                      href={`/dashboard/links/${id}`}
                      passHref
                      className="text-inherit hover:text-inherit"
                    >
                      <Button color="yellow" className="ml-2">
                        تعديل
                      </Button>
                    </Link>
                    <ButtonDeleteLink id={id} />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
