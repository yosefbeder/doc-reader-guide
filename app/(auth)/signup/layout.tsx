import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up | DocReader Guide",
  description: "Create a new account",
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
