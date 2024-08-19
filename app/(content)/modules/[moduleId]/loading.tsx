import CardPlaceholder from "@/components/CardPlaceholder";
import Path from "@/components/Path";

export default function SubjectsLoadingPage() {
  return (
    <>
      <Path>
        <div className="h-5" />
      </Path>
      <main className="main">
        <ul className="card-container">
          <CardPlaceholder type="subject" />
          <CardPlaceholder type="subject" />
          <CardPlaceholder type="subject" />
        </ul>
      </main>
    </>
  );
}
