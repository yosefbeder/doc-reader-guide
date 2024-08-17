"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { FormState } from "@/types";
import { API_URL } from "@/constants";

export async function login(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    cookies().set("jwt", json.data.token);
    redirect("/");
  } else {
    return { type: "fail", message: json.message };
  }
}

export async function signup(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmationPassword: formData.get("confirmation-password"),
    facultyId: +(formData.get("facultyId") as string),
    yearId: +(formData.get("yearId") as string),
  };

  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    cookies().set("jwt", json.data.token);
    redirect("/");
  } else {
    return { type: "fail", message: json.message };
  }
}

export async function updatePersonalInfo(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = {
    name: formData.get("name"),
    facultyId: +(formData.get("facultyId") as string),
    yearId: +(formData.get("yearId") as string),
  };

  const res = await fetch(`${API_URL}/user/update`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  revalidatePath("/", "layout");

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function updatePassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = {
    currentPassword: formData.get("current-password"),
    newPassword: formData.get("new-password"),
    confirmationPassword: formData.get("confirmation-password"),
  };

  const res = await fetch(`${API_URL}/user/change-password`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function addModule(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = {
    icon: formData.get("icon"),
    name: formData.get("name"),
    semesterName: +(formData.get("semester-name") as string),
  };

  const res = await fetch(
    `${API_URL}/modules/${formData.get("year-id")}/create`,
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

  revalidatePath("/dashboard/modules", "page");
  revalidatePath("/", "page");

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function updateModule(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = {
    icon: formData.get("icon"),
    name: formData.get("name"),
    semesterName: +(formData.get("semester-name") as string),
  };

  const res = await fetch(
    `${API_URL}/modules/${formData.get("year-id")}/${formData.get(
      "module-id"
    )}/update`,
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

  revalidatePath("/dashboard/modules", "page");
  revalidatePath("/", "page");

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function deleteModule(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const res = await fetch(
    `${API_URL}/modules/${formData.get("year-id")}/${formData.get(
      "module-id"
    )}/delete`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
    }
  );

  const json = await res.json();

  if (!res.ok) return { type: "fail", message: json.message };

  revalidatePath("/dashboard/modules", "page");
  revalidatePath("/", "page");

  return {};
}

export async function addSubject(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const yearId = formData.get("year-id");
  const moduleId = formData.get("module-id");
  const data = {
    icon: formData.get("icon"),
    name: formData.get("name"),
  };

  const res = await fetch(
    `${API_URL}/modules/${yearId}/${moduleId}/subjects/create`,
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

  revalidatePath("/dashboard/subjects", "page");
  revalidatePath(`/modules/${moduleId}`, "page");

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function updateSubject(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const moduleId = formData.get("module-id");
  const data = {
    icon: formData.get("icon"),
    name: formData.get("name"),
    moduleId,
  };

  const res = await fetch(
    `${API_URL}/subjects/${formData.get("subject-id")}/update`,
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

  revalidatePath("/dashboard/subjects", "page");
  revalidatePath(`/modules/${moduleId}`, "page");

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function deleteSubject(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const moduleId = formData.get("module-id");
  const res = await fetch(
    `${API_URL}/subjects/${formData.get("subject-id")}/delete`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
    }
  );

  const json = await res.json();

  if (!res.ok) return { type: "fail", message: json.message };

  revalidatePath("/dashboard/subjects", "page");
  revalidatePath(`/modules/${moduleId}`, "page");

  return {};
}

export async function addLecture(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const subjectId = formData.get("subject-id");
  const data = {
    title: formData.get("title"),
    subTitle: " ",
    date: formData.get("date"),
  };

  const res = await fetch(`${API_URL}/subjects/${subjectId}/create-lecture`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  revalidatePath("/dashboard/lectures", "page");
  revalidatePath(`/subjects/${subjectId}`, "page");

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function updateLecture(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = formData.get("lecture-id");
  const subjectId = formData.get("subject-id");
  const data = {
    title: formData.get("title"),
    subTitle: " ",
    date: formData.get("date"),
    subjectId,
  };

  const res = await fetch(`${API_URL}/lectures/${lectureId}/update`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  revalidatePath("/dashboard/lectures", "page");
  revalidatePath(`/subjects/${subjectId}`, "page");

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function deleteLecture(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = formData.get("lecture-id");
  const subjectId = formData.get("subject-id");
  const res = await fetch(`${API_URL}/lectures/${lectureId}/delete`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
  });

  const json = await res.json();

  if (!res.ok) return { type: "fail", message: json.message };

  revalidatePath("/dashboard/lectures", "page");
  revalidatePath(`/subjects/${subjectId}`, "page");

  return {};
}
