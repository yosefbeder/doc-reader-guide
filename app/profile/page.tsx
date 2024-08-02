import { Metadata } from "next";

import LogoutButton from "./components/LogoutButton";
import PersonalInfoForm from "./components/PersonalInfoForm";
import PasswordForm from "./components/PasswordForm";
import { getUser } from "@/utils";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "البيانات الشخصية | دوكريدر جايد",
  description: "عرض وتغيير البيانات العامة وتغيير الباسورد وتسجيل الخروج",
};

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <>
      <Nav title="البيانات الشخصية" name={user.name} />
      <main className="max-w-screen-md mx-auto px-2 py-4">
        <div className="max-w-md">
          <h2 className="mb-4">البيانات العامة</h2>
          <PersonalInfoForm user={user} />
          <h2 className="mb-4">تغيير كلمة المرور</h2>
          <PasswordForm />
          <h2 className="mb-4">تسجيل الخروج</h2>
          <LogoutButton />
        </div>
      </main>
    </>
  );
}
