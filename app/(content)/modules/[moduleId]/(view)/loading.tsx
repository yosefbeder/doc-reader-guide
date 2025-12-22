import CardPlaceholder from "@/components/CardPlaceholder";
import EmptyPath from "@/components/EmptyPath";
import Layout from "@/components/Layout";
export default function SubjectsLoadingPage() {
  return (
    <Layout updateable>
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
    </Layout>
  );
}
