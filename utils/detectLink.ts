import { LinkType, LinkCategory } from "@/types";

export default function detectLink(title: string): {
  category: LinkCategory;
  type: LinkType;
} {
  const output = {
    category: "College" as LinkCategory,
    type: "Record" as LinkType,
  };
  const documentKeyword =
    /كتاب|ملف|باور|سبورة|مقالي|ملزمة|مذكرة|book|file|power|whiteboard|written/gi;
  const externalKeyword =
    /الشريف|محمد فايز|ناجي|الحسيني|سامح غازي|أحمد عصام|عصام|إيمان نبيل|محمد عادل|محمد الشريف|خنفور|عبد المتعال|عبدالمتعال|محمود علاء|نهى|وجيه|القط|النمر|زهرة|زهره|شرين|شيرين|عبدالله سعد|عبد الله سعد|أحمد فريد|معاذ وهدان|أنس وهدان|أنس الهندي|تاح|الطوخي|زميلتنا|خالد المسلمي|الطويل|زميلنا|osmosis|crash course|ninja nerd|siebert science|mike|medicosis perfectionalis|animation|armando/gi;
  const summaryKeyword =
    /summary|notes|vip|important|imp|transcription|comparison|mind map|ملخص|تفريغ|تلخيص|أهم النقاط|اهم النقاط/gi;
  const questionKeyword =
    /quiz|mcq|written|department book|exam|bank|notebooklm|كويز|(أ|ا)سئل(ة|ه)|(إ|ا)متحان|كتاب القسم|بنك|مقالي|اختبار|اختياري/gi;
  if (title.match(externalKeyword)) {
    output.category = "Data";
    if (title.match(documentKeyword)) output.type = "PDF";
    else output.type = "Video";
  } else if (title.match(summaryKeyword)) {
    output.category = "Summary";
    output.type = "PDF";
  } else if (title.match(questionKeyword)) {
    output.category = "Questions";
    if (title.match(/notebooklm/gi)) output.type = "Data";
    else if (title.match(documentKeyword)) output.type = "PDF";
    else output.type = "Data";
  } else {
    output.category = "College";
    if (title.match(documentKeyword)) output.type = "PDF";
    else output.type = "Record";
  }
  return output;
}
