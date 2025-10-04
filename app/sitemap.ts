import type { MetadataRoute } from "next";
import {
  listModules,
  listSubjects,
  listLectures,
  listQuizzes,
} from "@/utils/allData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${origin}/`, priority: 1 },
    { url: `${origin}/android`, priority: 0.8 },
    { url: `${origin}/login`, priority: 0.5 },
  ];

  try {
    const dynamicUrls: MetadataRoute.Sitemap = [];

    const modules = await listModules();
    modules.forEach((m) => {
      dynamicUrls.push({
        url: `${origin}/modules/${m.id}`,
        lastModified: m.updatedAt,
        priority: 0.6,
      });
    });

    const subjects = await listSubjects();
    subjects.forEach((s) => {
      dynamicUrls.push({
        url: `${origin}/subjects/${s.id}`,
        lastModified: s.updatedAt,
        priority: 0.7,
      });
    });

    const lectures = await listLectures();
    lectures.forEach((l) => {
      dynamicUrls.push({
        url: `${origin}/lectures/${l.id}`,
        lastModified: l.updatedAt,
        priority: 0.9,
      });
    });

    const mcq = await listQuizzes("mcq");
    mcq.forEach((q) => {
      dynamicUrls.push({
        url: `${origin}/mcq-quizzes/${q.id}`,
        lastModified: q.updatedAt,
        priority: 0.8,
      });
    });

    const written = await listQuizzes("written");
    written.forEach((q) => {
      dynamicUrls.push({
        url: `${origin}/written-quizzes/${q.id}`,
        lastModified: q.updatedAt,
        priority: 0.8,
      });
    });

    return [...staticUrls, ...dynamicUrls];
  } catch (error) {
    console.warn("Could not connect to the API to generate sitemap. Returning static URLs only.");
    return staticUrls;
  }
}