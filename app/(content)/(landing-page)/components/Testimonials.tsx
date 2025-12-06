import { icons } from "@/components/icons";

const stats = [
  {
    labelEn: "Active Students",
    labelAr: "طالب وطالبة",
    value: "5,000+",
    icon: "user-group",
  },
  {
    labelEn: "Practice Questions",
    labelAr: "سؤال تدريبي",
    value: "140,000+",
    icon: "pencil-square",
  },
  {
    labelEn: "Resources",
    labelAr: "مصدر مذاكرة",
    value: "16,000+",
    icon: "building-library",
  },
];

const testimonials = [
  {
    id: 1,
    original:
      "الله يرضى عنكم ويرضيكم.. كنت أكررره الضياع بين القنوات والمصادر والملفات والتسجيلات، يضيع وقتي وأتعب نفسيا، صارت الدنيا كلها بمكان واحد ورتبتوها بشكل يفتح النفس ومريح ويساعد كثير صدق.. الله يوفقكم ويجزيكم خير الجزاء جميعًا.",
    translation:
      "May God be pleased with you. I used to hate getting lost between channels, sources, and files... I wasted time and got mentally exhausted. Now everything is in one place, arranged in a way that is encouraging and comfortable. May God grant you success.",
  },
  {
    id: 2,
    original:
      "جزيتم خيرًا جميعا جعله الله في ميزان حسناتكم.. حقيقة كنتم سببا في تيسير الوصول للداتا والملفات وكل ما هو متعلق بجميع المواد.. التطبيق منظم جدا جدا مما ييسر الوصول للفيديو او المحاضرة التي أبحث عنها وأيضا التحديث المستمر والدائم يجعل التطبيق رائع.. جزى الله خيرا كل من عمل عليه وساهم فيه.",
    translation:
      "May God reward you all. You truly facilitated access to data and files for all subjects. The app is very organized, making it easy to reach the video or lecture I'm looking for. The continuous updates make the app wonderful.",
  },
  {
    id: 3,
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
          {testimonials.map((item) => (
            <div key={item.id} className="card layer-1 clickable">
              <p className="caption text-base italic">
                {isAr ? item.original : item.translation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
