import Image from "next/image";

import logoAfmg from "@/public/logo-afmg.jpeg";
import logoAzharDamietta from "@/public/logo-azhar-damietta.webp";
import logoAinShams from "@/public/logo-ain-shams.png";
import logoAzharCairo from "@/public/logo-azhar-cairo-male.png";
import logoMansouraNational from "@/public/logo-mansoura-national.jpeg";
import logoMenoufia from "@/public/logo-menoufia.jpeg";
import logoNewMansoura from "@/public/logo-new-mansora.jpeg";
import logoSanaa from "@/public/logo-sanaa.png";
import logo21September from "@/public/logo-21-september.jpeg";

const ENROLLED = [
  { name: "AFMG", src: logoAfmg },
  { name: "Azhar Damietta", src: logoAzharDamietta },
];

const COMING_SOON = [
  { name: "Ain Shams", src: logoAinShams },
  { name: "Azhar Cairo", src: logoAzharCairo },
  { name: "Mansoura National", src: logoMansouraNational },
  { name: "Menoufia", src: logoMenoufia },
  { name: "New Mansoura", src: logoNewMansoura },
  { name: "Sanaa", src: logoSanaa },
  { name: "21 September", src: logo21September },
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
                    placeholder="blur"
                    className="object-contain"
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
