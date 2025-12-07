import Link from "next/link";
import Button from "@/components/Button";
import { icons } from "@/components/icons"; // Importing icons for the Android logo

export default function Hero({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";

  return (
    <section
      className={`pt-32 max-md:pt-48 pb-16 ${isAr ? "font-arabic" : ""}`}
    >
      <div className="main flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
          {isAr ? (
            <>
              <span className="inline-block mb-2">رفيقك في كلية الطب،</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
                مصمم لمنهج كليتك.
              </span>
            </>
          ) : (
            <>
              Your Medical Study Companion, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
                Tailored to Your Faculty.
              </span>
            </>
          )}
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
          {isAr
            ? "المنصة الشاملة لطلاب الطب في مصر. محاضرات مرتبة، أسئلة، ومساعد شخصي بالذكاء الاصطناعي."
            : "The all-in-one platform for Egyptian medical students. Organized lectures, Practice Questions, and AI assistance."}
        </p>

        <div className="flex flex-wrap justify-center gap-3 w-full sm:w-auto">
          <Link href="/login">
            <Button cta color="cyan">
              {isAr ? "ابدأ الآن" : "Get Started Now"}
            </Button>
          </Link>

          <a href={process.env.NEXT_PUBLIC_DOWNLOAD_LATEST} target="_blank">
            <Button color="white" className="flex items-center gap-2">
              {icons["android"]}
              {isAr ? "حمل تطبيق الأندرويد" : "Download Android App"}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
