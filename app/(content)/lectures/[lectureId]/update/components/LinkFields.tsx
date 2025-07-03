"use client";

import { useEffect, useState } from "react";

import Input from "@/components/Input";
import Select from "@/components/Select";
import { Link } from "@/types";

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
  const [type, setType] = useState(defaultValues?.type || "Video");

  useEffect(() => {
    if (defaultValues) return;
    const documentKeyword = /كتاب|ملف|باور|سبورة|book|file|power|whiteboard/gi;
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
        value={type}
        onChange={(e) => setType(e.target.value as any)}
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
