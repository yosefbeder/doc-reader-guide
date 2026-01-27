"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";

import Input from "@/components/Input";
import Select from "@/components/Select";
import { Link } from "@/types";
import detectLink from "@/utils/detectLink";
import ButtonIcon from "@/components/ButtonIcon";
import Checkbox from "@/components/Checkbox";
import { toast } from "sonner";

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isUploading]);

  useEffect(() => {
    if (defaultValues) return;
    const { category, type } = detectLink(title);
    setCategory(category);
    setType(type);
  }, [title]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Starting upload...");

    try {
      const presignedRes = await fetch(
        `/api/r2/presigned-url?file=${encodeURIComponent(
          selectedFile.name
        )}&type=${encodeURIComponent(selectedFile.type)}`
      );

      if (!presignedRes.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { signedUrl, publicUrl } = await presignedRes.json();

      if (!signedUrl || !publicUrl) {
        throw new Error("Failed to get presigned URL");
      }

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", selectedFile.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100
            );
            toast.loading(`Uploading... ${percentComplete}%`, {
              id: toastId,
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            console.error(xhr.responseText);
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(selectedFile);
      });
      toast.success("File uploaded successfully", { id: toastId });
      setUrls((prev) => [...prev, { id: currentCounter, value: publicUrl }]);
      setCurrentCounter((prev) => prev + 1);
      e.target.value = "";
      if (formId)
        (document.getElementById(formId) as HTMLFormElement).requestSubmit();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

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
      <div className="flex gap-2">
        <ButtonIcon
          icon="plus"
          type="button"
          onClick={() => {
            if (currentCounter >= +process.env.NEXT_PUBLIC_OPTIONS_LIMIT!)
              return;
            setUrls((prev) => [...prev, { id: currentCounter, value: "" }]);
            setCurrentCounter((prev) => prev + 1);
          }}
        />
        <input
          type="file"
          id="upload-file"
          accept=".pdf,audio/*"
          onChange={handleUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <ButtonIcon
          icon="arrow-up-tray"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        />
      </div>
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
