import Image from "next/image";

const ENROLLED = [
  { name: "AFMG", src: "/logo-afmg.jpeg" },
  { name: "Azhar Damietta", src: "/logo-azhar-damietta.webp" },
];

const COMING_SOON = [
  { name: "Ain Shams", src: "/logo-ain-shams.png" },
  { name: "Azhar Cairo", src: "/logo-azhar-cairo-male.png" },
  { name: "Mansoura National", src: "/logo-mansoura-national.jpeg" },
  { name: "Menoufia", src: "/logo-menoufia.jpeg" },
  { name: "New Mansoura", src: "/logo-new-mansora.jpeg" },
  { name: "Sanaa", src: "/logo-sanaa.png" },
  { name: "21 September", src: "/logo-21-september.jpeg" },
];

const UNIVERSITIES = [
  ...ENROLLED.map((u) => ({ ...u, comingSoon: false })),
  ...COMING_SOON.map((u) => ({ ...u, comingSoon: true })),
];

// Duplicate the list enough times to ensure smooth scrolling on wide screens
const MARQUEE_ITEMS = [...UNIVERSITIES, ...UNIVERSITIES, ...UNIVERSITIES];

export default function EnrolledUniversities({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";

  return (
    <section
      dir="ltr"
      className={`py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden ${isAr ? "font-arabic" : ""}`}
    >
      <div className="w-full">
        <div className="relative w-full flex">
          <div className="flex animate-scroll hover:pause gap-16 min-w-full items-center pl-16">
            {MARQUEE_ITEMS.map((uni, index) => (
              <div
                key={`${uni.name}-${index}`}
                className="group relative flex-shrink-0 size-24 flex items-center justify-center transition-all duration-300 filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-110"
              >
                {uni.comingSoon && (
                  <div className="absolute -top-3 -right-3 z-10 transition-opacity duration-300 pointer-events-none">
                    <span className="bg-slate-600/10 dark:bg-cyan-600 border border-slate-600/20 text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap">
                      {isAr ? "قريباً" : "Soon"}
                    </span>
                  </div>
                )}
                <div className="relative w-full h-full">
                  <Image
                    src={uni.src}
                    alt={uni.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 80px, 96px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
