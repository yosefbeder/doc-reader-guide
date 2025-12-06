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

  urls.push({
    url: `${origin}`,
    priority: 1,
  });

  urls.push({
    url: `${origin}/login`,
    priority: 1,
  });

  const modules = await listModules();
  modules.forEach((m) => {
    urls.push({
      url: `${origin}/modules/${m.id}`,
      lastModified: m.updatedAt,
      priority: 0.6,
    });
  });

  const subjects = await listSubjects();
  subjects.forEach((s) => {
    urls.push({
      url: `${origin}/subjects/${s.id}`,
      lastModified: s.updatedAt,
      priority: 0.7,
    });
  });

  const lectures = await listLectures();
  lectures.forEach((l) => {
    urls.push({
      url: `${origin}/lectures/${l.id}`,
      lastModified: l.updatedAt,
      priority: 0.9,
    });
  });

  const mcq = await listQuizzes("mcq");
  mcq.forEach((q) => {
    urls.push({
      url: `${origin}/mcq-quizzes/${q.id}`,
      lastModified: q.updatedAt,
      priority: 0.8,
    });
  });

  const written = await listQuizzes("written");
  written.forEach((q) => {
    urls.push({
      url: `${origin}/written-quizzes/${q.id}`,
      lastModified: q.updatedAt,
      priority: 0.8,
    });
  });

  return urls;
}
