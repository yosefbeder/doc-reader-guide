"use client";

import Cookies from "js-cookie";
import useSWR from "swr";

import LogoutButton from "./components/LogoutButton";
import PersonalInfoForm from "./components/PersonalInfoForm";
import PasswordForm from "./components/PasswordForm";
import getUser from "@/utils/getUser";
import getFaculties from "@/utils/getFaculties";
import ToggleNotifications from "./components/ToggleNotifications";
import Layout from "@/components/Layout";

export default function ProfilePage() {
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useSWR("user", async () => getUser(Cookies.get("jwt")!));
  const {
    data: faculties,
    isLoading: areFacultiesLoading,
    error: facultiesError,
  } = useSWR("faculties", getFaculties);

  return (
    <Layout title="البيانات الشخصية">
      <main className="main">
        <div className="max-w-md">
          <h2 className="mb-4">الإعدادات</h2>
          <h3 className="mb-4">الإشعارات</h3>
          <div className="flex flex-col items-start gap-4 mb-4">
            <ToggleNotifications />
          </div>
          <h2 className="mb-4">الحساب</h2>
          <h3 className="mb-4">البيانات العامة</h3>
          {isUserLoading || areFacultiesLoading ? (
            <p className="mb-4">تحميل...</p>
          ) : userError || facultiesError ? (
            <p className="mb-4">حدث خطأ</p>
          ) : (
            user &&
            faculties && <PersonalInfoForm faculties={faculties} user={user} />
          )}
          <h3 className="mb-4">تغيير كلمة المرور</h3>
          <PasswordForm />
          <h3 className="mb-4">تسجيل الخروج</h3>
          <LogoutButton className="mb-4" />
        </div>
      </main>
    </Layout>
  );
}
