import {
  initDB,
  ASSETS_CACHE_NAME,
  PAGES_CACHE_NAME,
  API_CACHE_NAME,
} from "./idb";
import getSubjects from "./getSubjectsClient";
import getLectures from "./getLecturesClient";
import { getMcqQuiz, getWrittenQuiz } from "./getQuizClient";
import getModule from "./getModuleClient";
import getLecture from "./getLectureClient";
import isValidURL from "./isValidURL";
import getUser from "./getUserClient";
import getModules from "./getModulesClient";
import getFaculties from "./getFaculties";

async function cacheAsset(url: string): Promise<number> {
  if (!url) return 0;
  try {
    const cache = await caches.open(ASSETS_CACHE_NAME);
    const match = await cache.match(url);
    if (!match) {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        await cache.put(url, new Response(blob, { headers: response.headers }));
        return blob.size;
      }
    }
    return 0;
  } catch (error) {
    console.error(`Failed to cache asset: ${url}`, error);
    return 0;
  }
}

async function cachePage(url: string): Promise<number> {
  try {
    const cache = await caches.open(PAGES_CACHE_NAME);
    const response = await fetch(url);
    if (response.ok) {
      const blob = await response.blob();
      await cache.put(url, new Response(blob, { headers: response.headers }));
      return blob.size;
    } else {
      console.warn(`Failed to fetch page: ${url}`, response.status);
      return 0;
    }
  } catch (error) {
    console.error(`Failed to cache page: ${url}`, error);
    return 0;
  }
}

async function cacheAPI(url: string, data: any): Promise<number> {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const jsonString = JSON.stringify(data);
    const response = new Response(jsonString, {
      headers: { "Content-Type": "application/json" },
    });
    await cache.put(url, response);
    return new TextEncoder().encode(jsonString).length;
  } catch (error) {
    console.error(`Failed to cache API data: ${url}`, error);
    return 0;
  }
}

export async function saveModuleToOffline(
  moduleId: number,
  onProgress?: (downloadedBytes: number) => void,
  signal?: AbortSignal
) {
  let downloadedBytes = 0;
  // For safety purposes
  downloadedBytes += await cachePage("/");
  downloadedBytes += await cachePage("/profile");
  downloadedBytes += await cachePage("/app");
  downloadedBytes += await cachePage("/android-app");
  const user = (await getUser())!;
  const modules = await getModules(user.year.id);
  downloadedBytes += await cacheAPI(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me?include=year`,
    {
      data: { user },
    }
  );
  downloadedBytes += await cacheAPI(
    `${process.env.NEXT_PUBLIC_API_URL}/years/${user.year.id}/modules?sort=createdAt`,
    { data: { modules } }
  );
  const faculties = await getFaculties();
  downloadedBytes += await cacheAPI(
    `${process.env.NEXT_PUBLIC_API_URL}/faculties`,
    {
      data: { faculties },
    }
  );

  const db = await initDB();
  const trackedKeys: { type: "asset-cache" | "page-cache"; key: string }[] = [];

  const addKey = (type: "asset-cache" | "page-cache", key: string) => {
    trackedKeys.push({ type, key });
  };

  const updateMeta = async (
    status: "offline" | "downloading" | "error",
    bytes: number
  ) => {
    await db.put(
      "meta",
      {
        timestamp: Date.now(),
        bytes,
        status,
        keys: trackedKeys,
      },
      moduleId
    );
  };

  try {
    if (signal?.aborted) throw new Error("Aborted");

    await updateMeta("downloading", 0);

    // 1. Fetch Module Info
    const moduleData = await getModule(moduleId);
    const modulePageUrl = `/modules/${moduleId}`;

    downloadedBytes += await cachePage(modulePageUrl);
    addKey("page-cache", modulePageUrl);

    if (moduleData.icon) {
      downloadedBytes += await cacheAsset(moduleData.icon);
      addKey("asset-cache", moduleData.icon);
    }

    onProgress?.(downloadedBytes);
    await updateMeta("downloading", 5);

    // 2. Fetch Subjects
    const subjects = await getSubjects(moduleId);
    const subjectsPageUrl = `/modules/${moduleId}`;

    downloadedBytes += await cachePage(subjectsPageUrl);
    addKey("page-cache", subjectsPageUrl);

    let totalItems = subjects.length;
    let processedItems = 0;

    for (const subject of subjects) {
      if (signal?.aborted) throw new Error("Aborted");
      if (subject.icon) {
        downloadedBytes += await cacheAsset(subject.icon);
        addKey("asset-cache", subject.icon);
      }

      // 3. Fetch Lectures
      const lectures = await getLectures(subject.id);
      const lecturesPageUrl = `/subjects/${subject.id}`;

      downloadedBytes += await cachePage(lecturesPageUrl);
      addKey("page-cache", lecturesPageUrl);

      totalItems += lectures.length;

      for (const lecture of lectures) {
        if (signal?.aborted) throw new Error("Aborted");

        const fullLecture = await getLecture(lecture.id);
        const lecturePageUrl = `/lectures/${lecture.id}`;

        downloadedBytes += await cachePage(lecturePageUrl);
        addKey("page-cache", lecturePageUrl);

        // 4. Fetch Quizzes
        // MCQ
        for (const quiz of fullLecture.mcqQuizzes || []) {
          const fullQuiz = await getMcqQuiz(quiz.id);
          const quizPageUrl = `/mcq-quizzes/${quiz.id}`;

          downloadedBytes += await cachePage(quizPageUrl);
          addKey("page-cache", quizPageUrl);

          // Assets in Questions
          for (const q of fullQuiz.questions) {
            if (q.image) {
              downloadedBytes += await cacheAsset(q.image);
              addKey("asset-cache", q.image);
            }
          }
        }

        // Written
        for (const quiz of fullLecture.writtenQuizzes || []) {
          const fullQuiz = await getWrittenQuiz(quiz.id);
          const quizPageUrl = `/written-quizzes/${quiz.id}`;

          downloadedBytes += await cachePage(quizPageUrl);
          addKey("page-cache", quizPageUrl);

          // Assets in Questions
          for (const q of fullQuiz.questions) {
            if (q.image) {
              const imageUrl = `${process.env.NEXT_PUBLIC_STATIC_URL!}/image/${q.image}`;
              downloadedBytes += await cacheAsset(imageUrl);
              addKey("asset-cache", imageUrl);
            }
            // HTML Answers
            for (const subQ of q.subQuestions) {
              if (subQ.answer) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(subQ.answer, "text/html");
                const images = doc.querySelectorAll("img");
                for (const img of images) {
                  const imageUrl = isValidURL(img.src)
                    ? img.src
                    : `${process.env.NEXT_PUBLIC_STATIC_URL}/${img.src}`;
                  downloadedBytes += await cacheAsset(imageUrl);
                  addKey("asset-cache", imageUrl);
                }
              }
            }
          }
        }

        processedItems++;
        onProgress?.(downloadedBytes);
        await updateMeta("downloading", downloadedBytes);
      }

      onProgress?.(downloadedBytes);
    }

    await updateMeta("offline", downloadedBytes);
    onProgress?.(downloadedBytes);
  } catch (error) {
    console.error("Error downloading module:", error);
    await db.put(
      "meta",
      {
        timestamp: Date.now(),
        bytes: downloadedBytes,
        status: "error",
        keys: trackedKeys, // Save partial keys so we can clean up
      },
      moduleId
    );
    throw error;
  }
}

export async function removeModuleFromOffline(moduleId: number) {
  const db = await initDB();
  const meta = await db.get("meta", moduleId);

  if (meta && meta.keys) {
    const cache = await caches.open(ASSETS_CACHE_NAME);
    const pagesCache = await caches.open(PAGES_CACHE_NAME);

    for (const item of meta.keys) {
      try {
        if (item.type === "asset-cache") {
          await cache.delete(item.key);
        } else if (item.type === "page-cache") {
          await pagesCache.delete(item.key);
        }
      } catch (e) {
        console.warn(`Failed to delete ${item.type} key: ${item.key}`, e);
      }
    }
  }

  await db.delete("meta", moduleId);
}

export async function getOfflineModuleStatus(moduleId: number) {
  const db = await initDB();
  return db.get("meta", moduleId);
}
