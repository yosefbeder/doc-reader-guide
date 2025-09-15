export default async function revalidate(path: string) {
  const res = await fetch("/api/revalidate", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
  await res.json();
}
