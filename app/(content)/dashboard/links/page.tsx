import Link from "next/link";

import getUser from "@/utils/getUser";
import getAllLectures from "@/utils/getAllLectures";
import getAllLinks from "@/utils/getAllLinks";

import Button from "@/components/Button";
import AddLinkForm from "./components/AddLinkForm";
import ButtonDeleteLink from "./components/ButtonDeleteLink";

export default async function LinksPage() {
  const { yearId } = await getUser();
  const lectures = await getAllLectures(yearId);
  const links = await getAllLinks(yearId);

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
              <th>الموديول</th>
              <th>المادة</th>
              <th>المحاضرة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {links.map(
              ({
                id,
                title,
                subTitle,
                url,
                type,
                category,
                moduleName,
                subjectName,
                lectureTitle,
              }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{title}</td>
                  <td>{subTitle}</td>
                  <td>{url}</td>
                  <td>{type}</td>
                  <td>{category}</td>
                  <td>{moduleName}</td>
                  <td>{subjectName}</td>
                  <td>{lectureTitle}</td>
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
