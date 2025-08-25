"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import getNumber from "@/utils/getNumber";
import { FormState } from "@/types";

export async function quickAdd(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const moduleId = formData.get("module-id") as string;
  const subjectsJson = formData.get("subjects") as string;

  if (!moduleId || !subjectsJson) {
    return {
      type: "fail",
      message: "Missing module-id or subjects data",
      resetKey: Date.now(),
    };
  }

  let subjects: {
    name: string;
    icon: string;
    lectures: { title: string; date: string }[];
  }[];

  try {
    subjects = JSON.parse(subjectsJson);
  } catch {
    return {
      type: "fail",
      message: "Invalid subjects JSON format",
      resetKey: Date.now(),
    };
  }

  const token = cookies().get("jwt")?.value;
  if (!token) {
    return {
      type: "fail",
      message: "Not authenticated",
      resetKey: Date.now(),
    };
  }

  let subjectSuccess = 0;
  let subjectFail = 0;
  let lectureSuccess = 0;
  let lectureFail = 0;

  const subjectPromises = subjects.map(async (subj) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}/subjects`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: subj.name, icon: subj.icon }),
      }
    );

    if (!res.ok) throw new Error("Subject add failed");

    const subjectData = await res.json();
    subjectSuccess++;

    // Add lectures for this subject
    const lectureResults = await Promise.allSettled(
      subj.lectures.map((lec) =>
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectData.data.subject.id}/lectures`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json;charset=UTF-8",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: lec.title,
              type: "Normal",
              date: new Date(lec.date).toISOString(),
            }),
          }
        ).then((res) => {
          if (!res.ok) throw new Error("Lecture add failed");
          return res.json();
        })
      )
    );

    lectureResults.forEach((r) =>
      r.status === "fulfilled" ? lectureSuccess++ : lectureFail++
    );

    return subjectData;
  });

  const results = await Promise.allSettled(subjectPromises);

  results.forEach((r) => {
    if (r.status === "rejected") subjectFail++;
  });

  // Revalidate module page
  revalidatePath(`/modules/${moduleId}`);
  revalidatePath(`/modules/${moduleId}/update`);

  return {
    type: subjectFail === 0 && lectureFail === 0 ? "success" : "fail",
    message: `Subjects: ${subjectSuccess} added, ${subjectFail} failed. Lectures: ${lectureSuccess} added, ${lectureFail} failed.`,
    resetKey: Date.now(),
  };
}

export async function addSubject(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const moduleId = formData.get("module-id");
  const data = {
    icon: formData.get("icon"),
    name: formData.get("name"),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}/subjects`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/modules/${moduleId}`);
    revalidatePath(`/modules/${moduleId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function updateSubject(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const subjectId = getNumber(formData, "subject-id");
  const moduleId = getNumber(formData, "module-id");
  const data = {
    icon: formData.get("icon"),
    name: formData.get("name"),
    moduleId,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectId}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/subjects/${subjectId}`);
    revalidatePath(`/modules/${moduleId}`);
    revalidatePath(`/modules/${moduleId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function deleteSubject(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const subjectId = getNumber(formData, "subject-id");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectId}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
    }
  );

  const json = await res.json();

  if (!res.ok)
    return { type: "fail", message: json.message, resetKey: Date.now() };

  revalidatePath(`/modules/${json.data.subject.moduleId}`);
  revalidatePath(`/modules/${json.data.subject.moduleId}/update`);

  return {};
}
