import { cookies } from "next/headers";
import { Metadata } from "next";

import LogoutButton from "./components/LogoutButton";
import PersonalInfoForm from "./components/PersonalInfoForm";
import PasswordForm from "./components/PasswordForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "البيانات الشخصية | دوكريدر جايد",
  description: "عرض وتغيير البيانات العامة وتغيير الباسورد وتسجيل الخروج",
};

export default async function ProfilePage() {
  const res = await fetch(`${process.env.API_URL}/user`, {
    headers: {
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message);

  const { data } = json;

  return (
    <main>
      <h1>البيانات الشخصية</h1>
      <Link href="/">الصفحة الرئيسية</Link>
      <h2>البيانات العامة</h2>
      <PersonalInfoForm user={data} />
      <h2>تغيير كلمة المرور</h2>
      <PasswordForm />
      <h2>تسجيل الخروج</h2>
      <LogoutButton />
    </main>
  );
}
