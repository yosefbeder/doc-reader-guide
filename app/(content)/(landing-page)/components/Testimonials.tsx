import { icons } from "@/components/icons";

const testimonials = [
  {
    original:
      "جزيتم خيرًا جميعا جعله الله في ميزان حسناتكم.. حقيقة كنتم سببا في تيسير الوصول للداتا والملفات وكل ما هو متعلق بجميع المواد.. التطبيق منظم جدا جدا مما ييسر الوصول للفيديو او المحاضرة التي أبحث عنها وأيضا التحديث المستمر والدائم يجعل التطبيق رائع.. جزى الله خيرا كل من عمل عليه وساهم فيه.",
    translation:
      "May God reward you all. You truly facilitated access to data and files for all subjects. The app is very organized, making it easy to reach the video or lecture I'm looking for. The continuous updates make the app wonderful.",
  },
  {
    original:
      "الله يرضى عنكم ويرضيكم.. كنت أكررره الضياع بين القنوات والمصادر والملفات والتسجيلات، يضيع وقتي وأتعب نفسيا، صارت الدنيا كلها بمكان واحد ورتبتوها بشكل يفتح النفس ومريح ويساعد كثير صدق.. الله يوفقكم ويجزيكم خير الجزاء جميعًا.",
    translation:
      "May God be pleased with you. I used to hate getting lost between channels, sources, and files... I wasted time and got mentally exhausted. Now everything is in one place, arranged in a way that is encouraging and comfortable. May God grant you success.",
  },
  {
    original:
      "الابليكشن فكرته جميله ومنظم جدا لما عرفته مبقتش افتح بي دي افات الكليه غير من عليه ربنا يجازيكم خير عنا.",
    translation:
      "The app's idea is beautiful and very organized. Since I found it, I haven't opened the college PDFs except through it. May God reward you with good.",
  },
];

export default function Testimonials({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";

  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="main col">
        <div className="text-center mb-4">
          <h2 className="mb-4">
            {isAr ? "ماذا يقول زملاؤك؟" : "Loved by Students"}
          </h2>
          <p>
            {isAr
              ? "آراء حقيقية من طلاب كليات الطب في مصر"
              : "Real feedback from medical students across Egypt who rely on DocReader Guide daily."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((item, index) => (
            <div key={index} className="relative card layer-1 clickable h-max">
              <div
                className={`flex gap-1 text-amber-400 ${isAr ? "justify-end" : "justify-start"
                  }`}
              >
                {icons.star}
                {icons.star}
                {icons.star}
                {icons.star}
                {icons.star}
              </div>
              <p
                className={`caption text-base leading-relaxed ${isAr ? "text-right" : "text-left"
                  }`}
              >
                {isAr ? item.original : item.translation}
              </p>
              <div className="caption flex items-center gap-1">
                <div className="text-green-500">{icons["check-badge"]}</div>
                <span>{isAr ? "مستخدم موثق" : "Verified User"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
