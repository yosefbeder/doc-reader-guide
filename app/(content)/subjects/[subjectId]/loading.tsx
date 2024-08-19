import CardPlaceholder from "@/components/CardPlaceholder";
import Path from "@/components/Path";

export default function LecturesLoadingPage() {
  return (
    <>
      <Path>
        <div className="h-5" />
      </Path>
      <main className="main">
        <ul className="card-container">
          <CardPlaceholder type="lecture" />
          <CardPlaceholder type="lecture" />
          <CardPlaceholder type="lecture" />
        </ul>
      </main>
    </>
  );
}
