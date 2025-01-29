import getFaculties from "@/utils/getFaculties";
import SignupForm from "./components/SignupForm";

export default async function SignupPage() {
  const faculties = await getFaculties();
  return <SignupForm faculties={faculties} />;
}

export const revalidate = 3600;
