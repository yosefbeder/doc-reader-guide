"use client";

import { useFormState } from "react-dom";
import Link from "next/link";

import { signup } from "@/lib/actions";

export default function SignupPage() {
  const [formState, formAction] = useFormState(signup, {});

  return (
    <main>
      {formState.errorMessage && <p>{formState.errorMessage}</p>}
      <form action={formAction}>
        <label htmlFor="name">اسم المستخدم</label>
        <input type="text" name="name" id="name" required />
        <label htmlFor="email">البريد الإلكتروني</label>
        <input type="email" name="email" id="email" required />
        <label htmlFor="password">كلمة المرور</label>
        <input type="password" name="password" id="password" required />
        <label htmlFor="faculty">الكلية</label>
        <select name="faculty" id="faculty" required>
          <option value={1}>كلية الطب جامعة الأزهر دمياط الجديدة</option>
          <option value={2}>القصر العيني جامعة القاهرة</option>
          <option value={3}>كلية الطب جامعة عين شمس</option>
        </select>
        <label htmlFor="year">السنة الدراسية</label>
        <select name="year" id="year" required>
          <option value={1}>الأولى</option>
          <option value={2}>الثانية</option>
          <option value={3}>الثالثة</option>
          <option value={4}>الرابعة</option>
          <option value={5}>الخامسة</option>
        </select>
        <div>
          <button type="submit">إنشاء حساب جديد</button>
          <Link href="/login">تسجيل الدخول</Link>
        </div>
      </form>
    </main>
  );
}
