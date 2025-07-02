"use client";

import Input from "@/components/Input";
import Select from "@/components/Select";
import { Link } from "@/types";
import { useEffect, useState } from "react";

export default function LinkFields({
  lectureId,
  defaultValues,
  formId,
}: {
  lectureId: number;
  defaultValues?: Link;
  formId?: string;
}) {
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [category, setCategory] = useState(
    defaultValues?.category || "College"
  );

  useEffect(() => {
    if (defaultValues) return;
    const externalKeyword =
      /الشريف|محمد فايز|ناجي|الحسيني|سامح غازي|أحمد عصام|عصام|إيمان نبيل|محمد عادل|محمد الشريف|خنفور|عبد المتعال|عبدالمتعال|محمود علاء|نهى|وجيه|القط|النمر|زهرة|زهره|شرين/gi;
    const summaryKeyword =
      /summary|notes|vip|important|imp|transcription|ملخص|تفريغ/gi;
    const questionKeyword =
      /quiz|mcq|written|department book|exam|bank|كويز|(أ|ا)سئل(ة|ه)|(إ|ا)متحان|كتاب القسم|بنك|مقالي|اختبار|اختياري/gi;
    if (title.match(externalKeyword)) setCategory("Data");
    else if (title.match(summaryKeyword)) setCategory("Summary");
    else if (title.match(questionKeyword)) setCategory("Questions");
    else setCategory("College");
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
        className="mb-4"
        form={formId}
      />
      <Input
        label="Description"
        icon="book-open"
        type="text"
        name="sub-title"
        id={`link-${defaultValues?.id || "new"}-sub-title`}
        defaultValue={defaultValues?.subTitle}
        className="mb-4"
        form={formId}
      />
      <Input
        label="Link"
        icon="link"
        type="url"
        name="url"
        id={`link-${defaultValues?.id || "new"}-url`}
        required
        defaultValue={defaultValues?.url}
        className="mb-4"
        form={formId}
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
        defaultValue={defaultValues?.type}
        className="mb-4"
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
        className="mb-4"
        form={formId}
      />
      <input
        type="number"
        name="lecture-id"
        id={`link-${defaultValues?.id || "new"}-lecture-id`}
        className="hidden"
        defaultValue={lectureId}
        form={formId}
      />
    </>
  );
}
