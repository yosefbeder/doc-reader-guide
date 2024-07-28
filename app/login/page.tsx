"use client";

import { useFormState } from "react-dom";
import Link from "next/link";

import { login } from "@/lib/actions";

export default function LoginPage() {
  const [formState, formAction] = useFormState(login, {});

  return (
    <main>
      {formState && <p>{formState.message}</p>}
      <form action={formAction}>
        <label htmlFor="email">البريد الإلكتروني</label>
        <input type="email" name="email" id="email" required />
        <label htmlFor="password">كلمة المرور</label>
        <input type="password" name="password" id="password" required />
        <button type="submit">تسجيل الدخول</button>
        <Link href="/signup">إنشاء حساب جديد</Link>
      </form>
    </main>
  );
}
