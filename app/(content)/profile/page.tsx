import { Metadata } from "next";

import LogoutButton from "./components/LogoutButton";
import PersonalInfoForm from "./components/PersonalInfoForm";
import PasswordForm from "./components/PasswordForm";
import getUser from "@/utils/getUser";

export const metadata: Metadata = {
  title: "البيانات الشخصية | دوكريدر جايد",
  description: "عرض وتغيير البيانات العامة وتغيير الباسورد وتسجيل الخروج",
};

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <main className="main">
      <div className="max-w-md">
        <h2 className="mb-4">تسجيل الخروج</h2>
        <LogoutButton className="mb-4" />
        <h2 className="mb-4">البيانات العامة</h2>
        <PersonalInfoForm user={user} />
        <h2 className="mb-4">تغيير كلمة المرور</h2>
        <PasswordForm />
      </div>
    </main>
  );
}
