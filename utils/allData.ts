// lib/api.ts

import { QuizType } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const JWT = process.env.NEXT_PUBLIC_JWT;

async function fetchWithAuth<T>(endpoint: string): Promise<T> {
  if (!API_URL || !JWT) {
    throw new Error("Missing NEXT_PUBLIC_API_URL or NEXT_PUBLIC_JWT");
  }

  const res = await fetch(`${API_URL}${endpoint}?fields=id,updatedAt`, {
    headers: {
      Authorization: `Bearer ${JWT}`,
      "Content-Type": "application/json",
    },
    cache: "no-store", // prevent stale data
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()).data;
}

export async function listModules(): Promise<any[]> {
  return (await fetchWithAuth<any>("/modules")).modules;
}

export async function listSubjects(): Promise<any[]> {
  return (await fetchWithAuth<any>(`/subjects`)).subjects;
}

export async function listLectures(): Promise<any[]> {
  return (await fetchWithAuth<any>(`/lectures`)).lectures;
}

export async function listQuizzes(type: QuizType): Promise<any[]> {
  const data = await fetchWithAuth<any>(`/${type}-quizzes`);
  return type === "mcq" ? data.mcqQuizzes : data.writtenQuizzes;
}
