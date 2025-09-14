export default async function revalidate(path: string) {
  await fetch("/api/revalidate", {
    method: "POST",
    body: JSON.stringify({ path }), // revalidate homepage
  });
}
