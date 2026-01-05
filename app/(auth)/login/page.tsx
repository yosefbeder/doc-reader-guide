import LoginContent from "./components/LoginContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - DocReader Guide",
  description: "Login to DocReader Guide",
};

export default function LoginPage() {
  return <LoginContent />;
}
