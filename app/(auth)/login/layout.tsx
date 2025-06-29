import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in | DocReader Guide",
  description: "Enter your credentials please",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
