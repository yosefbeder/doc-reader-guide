import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول | دوكريدر جايد",
  description: "أدخل بيانات حسابك",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
