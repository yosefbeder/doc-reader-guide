import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="main">
      <h2 className="mb-4">الأقسام</h2>
      <ul>
        <li>
          <Link href="/dashboard/modules">الموديولات</Link>
        </li>
        <li>
          <Link href="/dashboard/subjects">المواد</Link>
        </li>
        <li>
          <Link href="/dashboard/lectures">المحاضرات</Link>
        </li>
        <li>
          <Link href="/dashboard/links">المصادر</Link>
        </li>
      </ul>
    </main>
  );
}
