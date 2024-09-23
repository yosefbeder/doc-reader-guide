import CardPlaceholder from "@/components/CardPlaceholder";
import EmptyPath from "@/components/EmptyPath";
export default function SubjectsLoadingPage() {
  return (
    <>
      <EmptyPath />
      <main className="main">
        <ul className="card-container">
          <li>
            <CardPlaceholder type="subject" />
          </li>
          <li>
            <CardPlaceholder type="subject" />
          </li>
          <li>
            <CardPlaceholder type="subject" />
          </li>
          <li>
            <CardPlaceholder type="subject" />
          </li>
          <li>
            <CardPlaceholder type="subject" />
          </li>
          <li>
            <CardPlaceholder type="subject" />
          </li>
          <li>
            <CardPlaceholder type="subject" />
          </li>
          <li>
            <CardPlaceholder type="subject" />
          </li>
        </ul>
      </main>
    </>
  );
}
