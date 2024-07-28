import { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب جديد | دوكريدر جايد",
  description: "أنشئ حسابًا جديدًا",
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
