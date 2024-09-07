import Input from "@/components/Input";
import Select from "@/components/Select";
import { Lecture, Link } from "@/types";
import getUniqueObjectsById from "@/utils/getUniqueObjectsById";
import { useMemo, useState } from "react";
import { getModuleIdSubjects, getSubjectIdLectures } from "../../utils";

export default function LinkFields({
  lectures,
  defaultValues,
}: {
  lectures: Lecture[];
  defaultValues?: Link;
}) {
  const modules = useMemo(
    () =>
      getUniqueObjectsById(
        lectures.map(({ moduleId, moduleName }) => ({
          id: moduleId,
          name: moduleName,
        }))
      ),
    []
  );
  const [moduleId, setModuleId] = useState(
    defaultValues?.moduleId || modules[0].id
  );
  const subjects = useMemo(
    () =>
      getUniqueObjectsById(
        lectures.map(({ subjectId, subjectName, moduleId }) => ({
          id: subjectId,
          name: subjectName,
          moduleId,
        }))
      ),
    []
  );
  const [subjectId, setSubjectId] = useState(
    defaultValues?.subjectId || getModuleIdSubjects(subjects, moduleId)[0].id
  );
  const [lectureId, setLectureId] = useState(
    defaultValues?.lectureId || getSubjectIdLectures(lectures, subjectId)[0].id
  );

  return (
    <>
      {defaultValues && (
        <input
          id="link-id"
          name="link-id"
          className="hidden"
          defaultValue={defaultValues.id}
        />
      )}
      <Input
        label="العنوان"
        icon="book-open"
        type="text"
        id="title"
        name="title"
        required
        defaultValue={defaultValues?.title}
        className="mb-4"
      />
      <Input
        label="تحت العنوان"
        icon="book-open"
        type="text"
        id="sub-title"
        name="sub-title"
        defaultValue={defaultValues?.subTitle}
        className="mb-4"
      />
      <Input
        label="الرابط"
        icon="link"
        type="url"
        id="url"
        name="url"
        required
        defaultValue={defaultValues?.url}
        className="mb-4"
      />
      <Select
        label="النوع"
        icon="document"
        id="type"
        name="type"
        options={[
          { label: "Video", value: "Video" },
          { label: "Record", value: "Record" },
          { label: "PDF", value: "PDF" },
          { label: "Data", value: "Data" },
        ]}
        required
        defaultValue={defaultValues?.type}
        className="mb-4"
      />
      <Select
        label="القسم"
        icon="tag"
        id="category"
        name="category"
        options={[
          { label: "Data", value: "Data" },
          { label: "College", value: "College" },
          { label: "Summary", value: "Summary" },
        ]}
        required
        defaultValue={defaultValues?.category}
        className="mb-4"
      />
      <Select
        label="الموديول"
        icon="academic-cap"
        options={modules.map(({ id, name }) => ({
          label: name,
          value: id,
        }))}
        value={moduleId}
        onChange={(e) => {
          const nextModuleId = +e.target.value;
          setModuleId(nextModuleId);
          const nextSubjectId = getModuleIdSubjects(subjects, nextModuleId)[0]
            .id;
          setSubjectId(nextSubjectId);
          setLectureId(getSubjectIdLectures(lectures, subjectId)[0].id);
        }}
        required
        className="mb-4"
      />
      <Select
        label="المادة"
        icon="academic-cap"
        options={getModuleIdSubjects(subjects, moduleId).map(
          ({ id, name }) => ({
            label: name,
            value: id,
          })
        )}
        value={subjectId}
        onChange={(e) => {
          const nextSubjectId = +e.target.value;
          setSubjectId(nextSubjectId);
          setLectureId(getSubjectIdLectures(lectures, subjectId)[0].id);
        }}
        required
        className="mb-4"
      />
      <Select
        label="المحاضرة"
        icon="academic-cap"
        id="lecture-id"
        name="lecture-id"
        options={getSubjectIdLectures(lectures, subjectId).map(
          ({ id, title }) => ({
            label: title,
            value: id,
          })
        )}
        value={lectureId}
        onChange={(e) => setLectureId(+e.target.value)}
        required
        className="mb-4"
      />
    </>
  );
}
