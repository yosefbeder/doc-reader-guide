import CardPlaceholder from "@/components/CardPlaceholder";
import EmptyPath from "@/components/EmptyPath";
export default function LecturesLoadingPage() {
  return (
    <>
      <EmptyPath />
      <main className="main">
        <ul className="card-container">
          <li>
            <CardPlaceholder type="lecture" />
          </li>
          <li>
            <CardPlaceholder type="lecture" />
          </li>
          <li>
            <CardPlaceholder type="lecture" />
          </li>
          <li>
            <CardPlaceholder type="lecture" />
          </li>
          <li>
            <CardPlaceholder type="lecture" />
          </li>
          <li>
            <CardPlaceholder type="lecture" />
          </li>
          <li>
            <CardPlaceholder type="lecture" />
          </li>
          <li>
            <CardPlaceholder type="lecture" />
          </li>
        </ul>
      </main>
    </>
  );
}
