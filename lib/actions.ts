"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { FormState } from "@/types";
import { API_URL } from "@/constants";
import getNumber from "@/utils/getNumber";

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
    cookies().set("jwt", json.data.token, {
      expires: Date.now() + 90 * 24 * 60 * 60 * 1000,
    });
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
    facultyId: getNumber(formData, "facultyId"),
    yearId: getNumber(formData, "yearId"),
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
    facultyId: getNumber(formData, "facultyId"),
    yearId: getNumber(formData, "yearId"),
  };

  const res = await fetch(`${API_URL}/user/update`, {
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
    yearId: getNumber(formData, "year-id"),
    icon: formData.get("icon"),
    name: formData.get("name"),
    semesterName: getNumber(formData, "semester-name"),
  };

  const res = await fetch(`${API_URL}/modules/create`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/years/${data.yearId}`);
    revalidatePath(`/years/${data.yearId}/update`);
  }

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function updateModule(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const moduleId = getNumber(formData, "module-id");
  const data = {
    icon: formData.get("icon"),
    name: formData.get("name"),
    semesterName: getNumber(formData, "semester-name"),
  };

  const res = await fetch(`${API_URL}/modules/${moduleId}/update`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/modules/${moduleId}`);
    revalidatePath(`/years/${json.data.yearId}`);
    revalidatePath(`/years/${json.data.yearId}/update`);
  }

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function deleteModule(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const moduleId = getNumber(formData, "module-id");
  const res = await fetch(`${API_URL}/modules/${moduleId}/delete`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
  });

  const json = await res.json();

  if (!res.ok) return { type: "fail", message: json.message };

  revalidatePath(`/modules/${json.data.id}`);
  revalidatePath(`/years/${json.data.yearId}`);
  revalidatePath(`/years/${json.data.yearId}/update`);

  return {};
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

  const res = await fetch(`${API_URL}/modules/${moduleId}/subjects/create`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/modules/${moduleId}`);
    revalidatePath(`/modules/${moduleId}/update`);
  }

  return { type: res.ok ? "success" : "fail", message: json.message };
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

  const res = await fetch(`${API_URL}/subjects/${subjectId}/update`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/subjects/${subjectId}`);
    revalidatePath(`/modules/${moduleId}`);
    revalidatePath(`/modules/${moduleId}/update`);
  }

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function deleteSubject(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const subjectId = getNumber(formData, "subject-id");
  const res = await fetch(`${API_URL}/subjects/${subjectId}/delete`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
  });

  const json = await res.json();

  if (!res.ok) return { type: "fail", message: json.message };

  revalidatePath(`/modules/${json.data.moduleId}`);
  revalidatePath(`/modules/${json.data.moduleId}/update`);

  return {};
}

export async function addLecture(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const subjectId = getNumber(formData, "subject-id");
  const data = {
    title: formData.get("title"),
    type: "Normal",
    date: formData.get("date"),
    subjectId,
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

  if (res.ok) {
    revalidatePath(`/subjects/${subjectId}`);
    revalidatePath(`/subjects/${subjectId}/update`);
  }

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function updateLecture(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = getNumber(formData, "lecture-id");
  const subjectId = getNumber(formData, "subject-id");
  const data = {
    title: formData.get("title"),
    date: formData.get("date"),
    subjectId,
  };

  const res = await fetch(`${API_URL}/lectures/${lectureId}/update`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/lectures/${lectureId}`);
    revalidatePath(`/subjects/${subjectId}`);
    revalidatePath(`/subjects/${subjectId}/update`);
  }

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function deleteLecture(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = getNumber(formData, "lecture-id");
  const res = await fetch(`${API_URL}/lectures/${lectureId}/delete`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
  });

  const json = await res.json();

  if (!res.ok) return { type: "fail", message: json.message };

  revalidatePath(`/subjects/${json.data.subjectId}`);
  revalidatePath(`/subjects/${json.data.subjectId}/update`);

  return {};
}

export async function addLink(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = formData.get("lecture-id");
  const data = {
    title: formData.get("title"),
    subTitle: formData.get("sub-title") || undefined,
    url: formData.get("url"),
    type: formData.get("type"),
    category: formData.get("category"),
    lectureId,
  };

  const res = await fetch(`${API_URL}/lectures/${lectureId}/links/create`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/lectures/${lectureId}`);
    revalidatePath(`/lectures/${lectureId}/update`);
  }

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function updateLink(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const linkId = getNumber(formData, "link-id");
  const lectureId = getNumber(formData, "lecture-id");
  const data = {
    title: formData.get("title"),
    subTitle: formData.get("sub-title") || undefined,
    url: formData.get("url"),
    type: formData.get("type"),
    category: formData.get("category"),
    lectureId,
  };

  const res = await fetch(`${API_URL}/links/${linkId}/update`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/lectures/${lectureId}`);
    revalidatePath(`/lectures/${lectureId}/update`);
  }

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function deleteLink(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const linkId = formData.get("link-id");
  const res = await fetch(`${API_URL}/links/${linkId}/delete`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
  });

  const json = await res.json();

  if (!res.ok) return { type: "fail", message: json.message };

  revalidatePath(`/lectures/${json.data.lectureId}`);
  revalidatePath(`/lectures/${json.data.lectureId}/update`);

  return {};
}
