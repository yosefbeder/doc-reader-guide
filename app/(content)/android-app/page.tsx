import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { Suspense } from "react";
import Button from "@/components/Button";
import { icons } from "@/components/icons";

interface ReleaseData {
  latestVersionMetadata: {
    version: string;
    releaseDate: string;
    notes: string;
    mandatory: boolean;
    checksum: string;
    downloadUrl: string;
  };
}

async function getReleaseData(): Promise<ReleaseData | null> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_ANDROID_RELEASE_DATA!);

    if (!res.ok) {
      throw new Error("Failed to fetch release data");
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function AndroidAppPage() {
  const data = await getReleaseData();
  const release = data?.latestVersionMetadata;

  return (
    <Suspense>
      <main className="w-full max-w-xl py-8 px-2 col items-center mx-auto text-center">
        <Image src={Logo} width={128} alt="Logo" />
        <span className="text-4xl font-extrabold text-cyan-700 dark:text-cyan-500">
          DocReader Guide
        </span>
        <h1>Android App</h1>
        <p>Download the latest version for the best experience.</p>
        {release ? (
          <div className="layer-1 w-full rounded-xl p-4 text-left">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Version {release.version}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Released on{" "}
                  {new Date(release.releaseDate).toLocaleDateString()}
                </p>
              </div>
              {release.mandatory && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  Mandatory
                </span>
              )}
            </div>

            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none mb-6 text-slate-600 dark:text-slate-300">
              <p className="font-medium mb-2 text-slate-900 dark:text-slate-200">
                What&apos;s New:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {release.notes.split("\n").map((line, index) => {
                  const cleanLine = line.trim().replace(/^[-•]\s*/, "");
                  if (!cleanLine) return null;
                  return <li key={index}>{cleanLine}</li>;
                })}
              </ul>
            </div>

            <a href={release.downloadUrl} className="block w-full">
              <Button color="cyan" className="justify-center w-full">
                <span className="flex items-center justify-center gap-2">
                  {icons["android"]}
                  Download APK
                </span>
              </Button>
            </a>
          </div>
        ) : (
          <div className="w-full p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400">
            <p>Unable to load release information at this time.</p>
          </div>
        )}
        <Link href="/" className="link">
          ← Back to Home
        </Link>
      </main>
    </Suspense>
  );
}
