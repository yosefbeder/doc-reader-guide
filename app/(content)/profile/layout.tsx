import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | DocReader Guide",
  description: "Update profile, change password, or logout",
  robots: { index: false, follow: false, nocache: true },
};

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
