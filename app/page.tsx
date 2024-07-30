import Link from "next/link";

export default async function HomePage() {
  return (
    <main>
      <h1>الصفحة الرئيسية</h1>
      <Link href="/profile">البيانات الشخصية</Link>
    </main>
  );
}
