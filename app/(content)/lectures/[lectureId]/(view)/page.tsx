import getLecture from "@/utils/getLecture";
import LinksList from "../components/LinksList";
import Path from "../components/Path";
import HtmlContentServer from "@/components/HtmlContentServer";

export default async function LinksPage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const lecture = await getLecture(+lectureId);

  return (
    <>
      <Path lecture={lecture} />
      <main className="main flex max-md:flex-col-reverse gap-4 *:flex-1">
        <LinksList
          links={lecture.links}
          mcqQuizzes={lecture.mcqQuizzes}
          writtenQuizzes={lecture.writtenQuizzes}
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
