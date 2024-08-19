import CardPlaceholder from "@/components/CardPlaceholder";

export default function ModulesLoadingPage() {
  return (
    <main className="main">
      <ul className="card-container">
        <CardPlaceholder type="module" />
        <CardPlaceholder type="module" />
        <CardPlaceholder type="module" />
      </ul>
    </main>
  );
}
