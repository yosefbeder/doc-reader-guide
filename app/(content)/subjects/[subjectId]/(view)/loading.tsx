import CardPlaceholder from "@/components/CardPlaceholder";
import EmptyPath from "@/components/EmptyPath";
import Layout from "@/components/Layout";

export default function LecturesLoadingPage() {
  return (
    <Layout updateable>
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
    </Layout>
  );
}
