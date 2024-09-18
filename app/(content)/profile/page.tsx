import { Metadata } from "next";

import LogoutButton from "./components/LogoutButton";
import PersonalInfoForm from "./components/PersonalInfoForm";
import PasswordForm from "./components/PasswordForm";
import getUser from "@/utils/getUser";
import getFaculties from "@/utils/getFaculties";
import ToggleNotifications from "./components/ToggleNotifications";

export const metadata: Metadata = {
  title: "البيانات الشخصية | دوكريدر جايد",
  description: "عرض وتغيير البيانات العامة وتغيير الباسورد وتسجيل الخروج",
};

export default async function ProfilePage() {
  const user = await getUser();
  const faculties = await getFaculties();

  return (
    <main className="main">
      <div className="max-w-md">
        <h2 className="mb-4">الإعدادات</h2>
        <h3 className="mb-4">الإشعارات</h3>
        <div className="flex flex-col items-start gap-4 mb-4">
          <ToggleNotifications />
        </div>
        <h2 className="mb-4">الحساب</h2>
        <h3 className="mb-4">البيانات العامة</h3>
        <PersonalInfoForm faculties={faculties} user={user} />
        <h3 className="mb-4">تغيير كلمة المرور</h3>
        <PasswordForm />
        <h3 className="mb-4">تسجيل الخروج</h3>
        <LogoutButton className="mb-4" />
      </div>
    </main>
  );
}
