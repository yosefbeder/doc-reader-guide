import Link from "next/link";
import Button from "@/components/Button";
import { icons } from "@/components/icons";

export default function Hero({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";

  return (
    <section
      className={`bg-slate-50 dark:bg-slate-950 pt-32 max-md:pt-48 pb-16 ${isAr ? "font-arabic" : ""}`}
    >
      <div className="main flex flex-col items-center text-center max-w-3xl mx-auto gap-8">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
          {isAr ? (
            <>
              كل مصادر <span className="gradient-text">كليتك</span>
              <br />
              <span className="inline-block">في مكان واحد</span>
            </>
          ) : (
            <>
              <span className="gradient-text">Your Faculty</span>
              <br />
              in Your Pocket
            </>
          )}
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
          {isAr ? (
            <>
              يحتوي على جميع أنواع الأسئلة ومصادر المذاكرة الخاصة{" "}
              <b className="gradient-text">بكليتك</b> بشكل{" "}
              <b className="gradient-text">مجاني 100%</b>
            </>
          ) : (
            <>
              The ultimate organizer for{" "}
              <b className="gradient-text">your faculty</b> practice questions
              and study materials, <b className="gradient-text">100% free</b>
            </>
          )}
        </p>

        <div className="flex flex-wrap justify-center gap-3 w-full sm:w-auto">
          <Link href="/login">
            <Button color="cyan" cta>
              {isAr ? "ابدأ الآن" : "Get Started Now"}
            </Button>
          </Link>

          <Link href="/android-app">
            <Button color="white" className="flex items-center gap-2">
              {icons["android"]}
              {isAr ? "حمل تطبيق الأندرويد" : "Download Android App"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
