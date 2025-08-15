import getLecture, { getLectureLinksAndQuizzes } from "@/utils/getLecture";
import LinksList from "../components/LinksList";
import Path from "../components/Path";
import HtmlContentServer from "@/components/HtmlContentServer";

export default async function LinksPage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const [lecture, { links, mcqQuizzes, writtenQuizzes }] = await Promise.all([
    getLecture(+lectureId),
    getLectureLinksAndQuizzes(+lectureId),
  ]);

  return (
    <>
      <Path lecture={lecture} />
      <main className="main flex max-md:flex-col-reverse gap-4 *:flex-1">
        <LinksList
          links={links}
          mcqQuizzes={mcqQuizzes}
          writtenQuizzes={writtenQuizzes}
        />
        {lecture.note && lecture.note !== "<p><br></p>" && (
          <HtmlContentServer
            className="rounded-xl p-2 bg-slate-50"
            html={lecture.note}
          />
        )}
      </main>
    </>
  );
}
