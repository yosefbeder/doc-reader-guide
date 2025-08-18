// app/sitemap.ts
import type { MetadataRoute } from "next";
import {
  listModules,
  listSubjects,
  listLectures,
  listQuizzes,
} from "@/utils/allData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_FRONTEND_URL!;
  const urls: MetadataRoute.Sitemap = [];

  const modules = await listModules();
  modules.forEach((m) => {
    urls.push({
      url: `${origin}/modules/${m.id}`,
      changeFrequency: "yearly",
      lastModified: m.updatedAt,
      priority: 0.5,
    });
  });

  const subjects = await listSubjects();
  subjects.forEach((s) => {
    urls.push({
      url: `${origin}/subjects/${s.id}`,
      changeFrequency: "yearly",
      lastModified: s.updatedAt,
      priority: 0.5,
    });
  });

  const lectures = await listLectures();
  lectures.forEach((l) => {
    urls.push({
      url: `${origin}/lectures/${l.id}`,
      changeFrequency: "weekly",
      lastModified: l.updatedAt,
      priority: 0.8,
    });
  });

  const mcq = await listQuizzes("mcq");
  mcq.forEach((q) => {
    urls.push({
      url: `${origin}/mcq-quizzes/${q.id}`,
      changeFrequency: "weekly",
      lastModified: q.updatedAt,
      priority: 0.5,
    });
  });

  const written = await listQuizzes("written");
  written.forEach((q) => {
    urls.push({
      url: `${origin}/written-quizzes/${q.id}`,
      changeFrequency: "weekly",
      lastModified: q.updatedAt,
      priority: 0.5,
    });
  });

  // Optional: include /android landing page
  urls.push({
    url: `${origin}/android`,
    changeFrequency: "yearly",
    priority: 1,
  });

  return urls;
}
