"use client";

import { useEffect, useState } from "react";

import Input from "@/components/Input";
import Select from "@/components/Select";
import { Link } from "@/types";
import ButtonIcon from "@/components/ButtonIcon";
import Checkbox from "@/components/Checkbox";

export default function LinkFields({
  lectureId,
  defaultValues,
  formId,
  yearId,
}: {
  lectureId: number;
  defaultValues?: Link;
  formId?: string;
  yearId: number;
}) {
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [category, setCategory] = useState(
    defaultValues?.category || "College"
  );
  const [type, setType] = useState(defaultValues?.type || "Video");
  const [urls, setUrls] = useState(
    defaultValues
      ? defaultValues.urls.map((url, index) => ({ id: index, value: url }))
      : [{ id: 0, value: "" }]
  );
  const [currentCounter, setCurrentCounter] = useState(
    defaultValues ? defaultValues.urls.length : 1
  );

  useEffect(() => {
    if (defaultValues) return;
    const documentKeyword =
      /كتاب|ملف|باور|سبورة|مقالي|ملزمة|مذكرة|book|file|power|whiteboard|written/gi;
    const externalKeyword =
      /الشريف|محمد فايز|ناجي|الحسيني|سامح غازي|أحمد عصام|عصام|إيمان نبيل|محمد عادل|محمد الشريف|خنفور|عبد المتعال|عبدالمتعال|محمود علاء|نهى|وجيه|القط|النمر|زهرة|زهره|شرين|شيرين|عبدالله سعد|عبد الله سعد|أحمد فريد|معاذ وهدان|أنس وهدان|أنس الهندي|تاح|الطوخي|زميلتنا|خالد المسلمي|الطويل|زميلنا|osmosis|crash course|ninja nerd|siebert science|mike|medicosis perfectionalis|animation|armando/gi;
    const summaryKeyword =
      /summary|notes|vip|important|imp|transcription|comparison|mind map|ملخص|تفريغ|تلخيص|أهم النقاط|اهم النقاط/gi;
    const questionKeyword =
      /quiz|mcq|written|department book|exam|bank|كويز|(أ|ا)سئل(ة|ه)|(إ|ا)متحان|كتاب القسم|بنك|مقالي|اختبار|اختياري/gi;
    if (title.match(externalKeyword)) {
      setCategory("Data");
      if (title.match(documentKeyword)) setType("PDF");
      else setType("Video");
    } else if (title.match(summaryKeyword)) {
      setCategory("Summary");
      setType("PDF");
    } else if (title.match(questionKeyword)) {
      setCategory("Questions");
      if (title.match(documentKeyword)) setType("PDF");
      else setType("Data");
    } else {
      setCategory("College");
      if (title.match(documentKeyword)) setType("PDF");
      else setType("Record");
    }
  }, [title]);

  return (
    <>
      {defaultValues && (
        <input
          type="number"
          name="link-id"
          id={`link-${defaultValues?.id || "new"}-id`}
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
        />
      )}
      <Input
        label="Title"
        icon="book-open"
        type="text"
        name="title"
        id={`link-${defaultValues?.id || "new"}-title`}
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        form={formId}
      />
      <Input
        label="Description"
        icon="book-open"
        type="text"
        name="sub-title"
        id={`link-${defaultValues?.id || "new"}-sub-title`}
        defaultValue={defaultValues?.subTitle}
        form={formId}
      />
      <ul className="flex flex-col gap-2 mb-4">
        {urls.map(({ id, value }, index) => (
          <li key={id} className="flex items-center gap-2">
            <input
              type="url"
              id={`link-${defaultValues?.id || "new"}-url-${id}`}
              name={`url-${id}`}
              className="grow"
              placeholder="https://example.com/"
              value={value}
              onChange={(e) => {
                setUrls((prev) => [
                  ...prev.slice(0, index),
                  { id, value: e.target.value },
                  ...prev.slice(index + 1),
                ]);
              }}
              form={formId}
            />
            <ButtonIcon
              icon="x-mark"
              disabled={urls.length < 2}
              onClick={() =>
                setUrls((prev) => [
                  ...prev.slice(0, index),
                  ...prev.slice(index + 1),
                ])
              }
            />
          </li>
        ))}
      </ul>
      <ButtonIcon
        icon="plus"
        type="button"
        className="self-start"
        onClick={() => {
          if (currentCounter >= +process.env.NEXT_PUBLIC_OPTIONS_LIMIT!) return;
          setUrls((prev) => [...prev, { id: currentCounter, value: "" }]);
          setCurrentCounter((prev) => prev + 1);
        }}
      />
      <Select
        label="Type"
        icon="document"
        name="type"
        id={`link-${defaultValues?.id || "new"}-type`}
        options={[
          { label: "Video", value: "Video" },
          { label: "Record", value: "Record" },
          { label: "Document", value: "PDF" },
          { label: "Form", value: "Data" },
        ]}
        required
        value={type}
        onChange={(e) => setType(e.target.value as any)}
        form={formId}
      />
      <Select
        label="Category"
        icon="tag"
        name="category"
        id={`link-${defaultValues?.id || "new"}-category`}
        options={[
          { label: "External", value: "Data" },
          { label: "College", value: "College" },
          { label: "Summaries", value: "Summary" },
          { label: "Questions", value: "Questions" },
        ]}
        required
        value={category}
        onChange={(e) => setCategory(e.target.value as any)}
        form={formId}
      />
      <Checkbox label="Notify?" name="notify" form={formId} />
      <input
        type="number"
        name="lecture-id"
        id={`link-${defaultValues?.id || "new"}-lecture-id`}
        className="hidden"
        defaultValue={lectureId}
        form={formId}
      />
      <input
        type="number"
        name="year-id"
        id={`link-${defaultValues?.id || "new"}-year-id`}
        className="hidden"
        defaultValue={yearId}
        form={formId}
      />
    </>
  );
}
