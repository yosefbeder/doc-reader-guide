import { Metadata } from "next";

export const metadata: Metadata = {
  title: "البيانات الشخصية | دوكريدر جايد",
  description: "عرض وتغيير البيانات العامة وتغيير الباسورد وتسجيل الخروج",
};

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
