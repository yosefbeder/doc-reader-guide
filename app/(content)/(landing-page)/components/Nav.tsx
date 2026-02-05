import Link from "next/link";
import Logo from "@/components/Logo";
import { icons } from "@/components/icons";
import Button from "@/components/Button";

export default function Nav({
  lang,
  toggleLanguage,
}: {
  lang: "en" | "ar";
  toggleLanguage: () => void;
}) {
  const isAr = lang === "ar";

  return (
    <nav className="fixed top-0 left-0 w-full z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="main flex items-center justify-between py-6 max-md:flex-col max-md:gap-4">
        <Link href="/" className="no-underline">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-slate-600 hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-500 transition-colors"
            aria-label="Switch Language"
          >
            {icons["language"]}
            <span
              className={`text-sm font-medium ${isAr ? "" : "font-arabic"}`}
            >
              {isAr ? "English" : "العربية"}
            </span>
          </button>
          <Link href="/login">
            <Button cta color="cyan" className={isAr ? "font-arabic" : ""}>
              {isAr ? "ابدأ الآن" : "Get Started Now"}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
