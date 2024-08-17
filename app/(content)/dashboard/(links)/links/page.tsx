import Link from "next/link";

import getLectures from "@/utils/getLectures";
import getModules from "@/utils/getModules";
import getSubjects from "@/utils/getSubjects";
import getUser from "@/utils/getUser";
import Button from "@/components/Button";
import { getLectureLinks } from "@/utils/getLecture";
import { getPracticalLinks } from "@/utils/getPractical";
import { getFinalRevisionLinks } from "@/utils/getFinalRevision";
import AddLinkForm from "./components/AddLinkForm";
import ButtonDeleteLink from "../components/ButtonDeleteLink";

export default async function LinksPage() {
  const { yearId } = await getUser();
  const modules = await getModules(yearId);
  const subjects = (
    await Promise.all(
      modules.map(async (module) => await getSubjects(yearId, module.id))
    )
  ).flat();
  const lectures = (
    await Promise.all(
      subjects.map(async (subject) => await getLectures(subject.id))
    )
  ).flat();
  const lectureLinks = (
    await Promise.all(
      lectures.map(async (lecture) => await getLectureLinks(lecture.id))
    )
  ).flat();
  const practicalLinks = (
    await Promise.all(
      subjects.map(async (subject) =>
        (
          await getPracticalLinks(subject.id)
        ).map((link) => ({ ...link, subjectId: subject.id }))
      )
    )
  ).flat();
  const finalRevisionLinks = (
    await Promise.all(
      subjects.map(async (subject) =>
        (
          await getFinalRevisionLinks(subject.id)
        ).map((link) => ({ ...link, subjectId: subject.id }))
      )
    )
  ).flat();

  return (
    <main className="main">
      <h2 className="mb-4">إضافة مصدر</h2>
      <AddLinkForm />
      <h2 className="mb-4">عرض مصادر المحاضرات</h2>
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
                <tr>
                  <td>{id}</td>
                  <td>{title}</td>
                  <td>{subTitle}</td>
                  <td>{url}</td>
                  <td>{type}</td>
                  <td>{category}</td>
                  <td>{lectureId}</td>
                  <td>
                    <Link
                      href={`/dashboard/lectures-links/${id}`}
                      passHref
                      className="text-inherit hover:text-inherit"
                    >
                      <Button color="yellow" className="ml-2">
                        تعديل
                      </Button>
                    </Link>
                    <ButtonDeleteLink
                      linkId={id}
                      place="lectures"
                      id={lectureId}
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <h2 className="mb-4">عرض مصادر العملي</h2>

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
              <th>المادة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {practicalLinks.map(
              ({ id, title, subTitle, url, type, category, subjectId }) => (
                <tr>
                  <td>{id}</td>
                  <td>{title}</td>
                  <td>{subTitle}</td>
                  <td>{url}</td>
                  <td>{type}</td>
                  <td>{category}</td>
                  <td>{subjectId}</td>
                  <td>
                    <Link
                      href={`/dashboard/practical-links/${subjectId}`}
                      passHref
                      className="text-inherit hover:text-inherit"
                    >
                      <Button color="yellow" className="ml-2">
                        تعديل
                      </Button>
                    </Link>
                    <ButtonDeleteLink
                      linkId={id}
                      place="practical"
                      id={subjectId}
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <h2 className="mb-4">عرض مصادر المراجعة النهائية</h2>
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
              <th>المادة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {finalRevisionLinks.map(
              ({ id, title, subTitle, url, type, category, subjectId }) => (
                <tr>
                  <td>{id}</td>
                  <td>{title}</td>
                  <td>{subTitle}</td>
                  <td>{url}</td>
                  <td>{type}</td>
                  <td>{category}</td>
                  <td>{subjectId}</td>
                  <td>
                    <Link
                      href={`/dashboard/final-revision-links/${subjectId}`}
                      passHref
                      className="text-inherit hover:text-inherit"
                    >
                      <Button color="yellow" className="ml-2">
                        تعديل
                      </Button>
                    </Link>
                    <ButtonDeleteLink
                      linkId={id}
                      place="final-revision"
                      id={subjectId}
                    />
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
