import Image, { StaticImageData } from "next/image";

// Logos
import logoAfmg from "@/public/logo-afmg.jpeg";
import logoAinShams from "@/public/logo-ain-shams.png";
import logoAzharDamietta from "@/public/logo-azhar-damietta.webp";

// Dark Screenshots
import afmg58_1_Dark from "@/public/images/testimonials/dark/afmg-58-1.jpeg";
import afmg58_2_Dark from "@/public/images/testimonials/dark/afmg-58-2.jpeg";
import afmg59_1_Dark from "@/public/images/testimonials/dark/afmg-59-1.jpeg";
import afmg59_2_Dark from "@/public/images/testimonials/dark/afmg-59-2.jpeg";
import afmg60_Dark from "@/public/images/testimonials/dark/afmg-60.jpeg";
import ainShams78_Dark from "@/public/images/testimonials/dark/ain-shams-78.jpeg";
import azharDamietta24_1_Dark from "@/public/images/testimonials/dark/azhar-damietta-24-1.jpeg";
import azharDamietta24_2_Dark from "@/public/images/testimonials/dark/azhar-damietta-24-2.jpeg";
import azharDamietta25_1_Dark from "@/public/images/testimonials/dark/azhar-damietta-25-1.jpeg";
import azharDamietta25_2_Dark from "@/public/images/testimonials/dark/azhar-damietta-25-2.jpeg";

// Light Screenshots
import afmg58_1_Light from "@/public/images/testimonials/light/afmg-58-1.jpeg";
import afmg58_2_Light from "@/public/images/testimonials/light/afmg-58-2.jpeg";
import afmg59_1_Light from "@/public/images/testimonials/light/afmg-59-1.jpeg";
import afmg59_2_Light from "@/public/images/testimonials/light/afmg-59-2.jpeg";
import afmg60_Light from "@/public/images/testimonials/light/afmg-60.jpeg";
import ainShams78_Light from "@/public/images/testimonials/light/ain-shams-78.jpeg";
import azharDamietta24_1_Light from "@/public/images/testimonials/light/azhar-damietta-24-1.jpeg";
import azharDamietta24_2_Light from "@/public/images/testimonials/light/azhar-damietta-24-2.jpeg";
import azharDamietta25_1_Light from "@/public/images/testimonials/light/azhar-damietta-25-1.jpeg";
import azharDamietta25_2_Light from "@/public/images/testimonials/light/azhar-damietta-25-2.jpeg";

interface Testimonial {
  screenshotDark: StaticImageData;
  screenshotLight: StaticImageData;
  logo: StaticImageData;
  batch: string;
  universityEn: string;
  universityAr: string;
}

const testimonials: Testimonial[] = [
  {
    screenshotDark: afmg58_1_Dark,
    screenshotLight: afmg58_1_Light,
    logo: logoAfmg,
    batch: "58",
    universityEn: "AFMG",
    universityAr: "أزهر بنات القاهرة",
  },
  {
    screenshotDark: afmg58_2_Dark,
    screenshotLight: afmg58_2_Light,
    logo: logoAfmg,
    batch: "58",
    universityEn: "AFMG",
    universityAr: "أزهر بنات القاهرة",
  },
  {
    screenshotDark: afmg59_1_Dark,
    screenshotLight: afmg59_1_Light,
    logo: logoAfmg,
    batch: "59",
    universityEn: "AFMG",
    universityAr: "أزهر بنات القاهرة",
  },
  {
    screenshotDark: afmg59_2_Dark,
    screenshotLight: afmg59_2_Light,
    logo: logoAfmg,
    batch: "59",
    universityEn: "AFMG",
    universityAr: "أزهر بنات القاهرة",
  },
  {
    screenshotDark: afmg60_Dark,
    screenshotLight: afmg60_Light,
    logo: logoAfmg,
    batch: "60",
    universityEn: "AFMG",
    universityAr: "أزهر بنات القاهرة",
  },
  {
    screenshotDark: ainShams78_Dark,
    screenshotLight: ainShams78_Light,
    logo: logoAinShams,
    batch: "78",
    universityEn: "Ain Shams",
    universityAr: "عين شمس",
  },
  {
    screenshotDark: azharDamietta24_1_Dark,
    screenshotLight: azharDamietta24_1_Light,
    logo: logoAzharDamietta,
    batch: "24",
    universityEn: "Azhar Damietta",
    universityAr: "أزهر دمياط",
  },
  {
    screenshotDark: azharDamietta24_2_Dark,
    screenshotLight: azharDamietta24_2_Light,
    logo: logoAzharDamietta,
    batch: "24",
    universityEn: "Azhar Damietta",
    universityAr: "أزهر دمياط",
  },
  {
    screenshotDark: azharDamietta25_1_Dark,
    screenshotLight: azharDamietta25_1_Light,
    logo: logoAzharDamietta,
    batch: "25",
    universityEn: "Azhar Damietta",
    universityAr: "أزهر دمياط",
  },
  {
    screenshotDark: azharDamietta25_2_Dark,
    screenshotLight: azharDamietta25_2_Light,
    logo: logoAzharDamietta,
    batch: "25",
    universityEn: "Azhar Damietta",
    universityAr: "أزهر دمياط",
  },
];

export default function Testimonials({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";

  return (
    <section
      className={`py-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 ${
        isAr ? "font-arabic" : ""
      }`}
    >
      <div className="main col">
        <div className="text-center mb-8">
          <h2 className="text-2xl mb-2">
            {isAr ? "ماذا يقول زملاؤك؟" : "Loved by Students"}
          </h2>
          <p>
            {isAr
              ? "آراء من طلاب يعتمدون على التطبيق بشكل دوري"
              : "Feedback from medical students who rely on DocReader Guide"}
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((item, index) => (
            <div
              key={`testimonial-${index}`}
              className="relative break-inside-avoid"
            >
              <div className="relative w-full rounded-xl overflow-hidden pt-6">
                <Image
                  src={item.screenshotLight}
                  alt={`Testimonial from ${isAr ? item.universityAr : item.universityEn} Batch ${item.batch}`}
                  placeholder="blur"
                  className="w-full h-auto object-cover dark:hidden"
                />
                <Image
                  src={item.screenshotDark}
                  alt={`Testimonial from ${isAr ? item.universityAr : item.universityEn} Batch ${item.batch}`}
                  placeholder="blur"
                  className="w-full h-auto object-cover hidden dark:block"
                />
              </div>

              <div className="absolute -top-0 -right-4">
                <div className="relative size-16">
                  <Image
                    src={item.logo}
                    alt={`${isAr ? item.universityAr : item.universityEn} Logo`}
                    placeholder="blur"
                    className="w-full h-auto rounded-full bg-white shadow-md p-0.5 object-contain"
                  />
                </div>
              </div>

              <div className="absolute bottom-0 left-0">
                <span className="bg-cyan-600 text-white text-base px-2 py-0.5 rounded-bl-xl rounded-tr-xl backdrop-blur-sm whitespace-nowrap">
                  {isAr ? "دفعة" : "Batch"} {item.batch}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
