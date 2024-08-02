"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import Image from "next/image";

import { signup } from "@/lib/actions";
import ButtonSubmit from "@/components/ButtonSubmit";
import Logo from "@/public/logo.png";
import Message from "@/components/Message";
import Input from "@/components/Input";
import Select from "@/components/Select";

export default function SignupPage() {
  const [formState, formAction] = useFormState(signup, {});
  const [hover, setHover] = useState(false);

  return (
    <main
      className={`card flex flex-col items-center gap-4 ${hover && "hover"}`}
    >
      <Image src={Logo} width={128} alt="Logo" />
      <h1>دوكريدر جايد</h1>
      <form action={formAction} className="w-full">
        <Input
          label="اسم المستخدم"
          icon="user"
          type="text"
          name="name"
          id="name"
          required
          className="mb-4"
        />
        <Input
          label="البريد الإلكتروني"
          icon="envelope"
          type="email"
          name="email"
          id="email"
          required
          className="mb-4"
        />
        <Input
          label="كلمة المرور"
          icon="eye-slash"
          type="password"
          name="password"
          id="password"
          required
          className="mb-4"
        />
        <Input
          label="تأكيد كلمة المرور"
          icon="eye-slash"
          type="password"
          name="confirmation-password"
          id="confirmation-password"
          required
          className="mb-4"
        />
        <Select
          label="الكلية"
          icon="building-library"
          options={[
            { value: 1, label: "كلية الطب جامعة الأزهر دمياط الجديدة" },
            { value: 2, label: "القصر العيني جامعة القاهرة" },
            { value: 3, label: "كلية الطب جامعة عين شمس" },
          ]}
          name="faculty"
          id="faculty"
          required
          className="mb-4"
        />
        <Select
          label="السنة الدراسية"
          icon="calendar"
          options={[
            { value: 1, label: "الأولى" },
            { value: 2, label: "الثاني" },
            { value: 3, label: "الثالث" },
            { value: 4, label: "الرابع" },
            { value: 5, label: "الخامس" },
          ]}
          name="year"
          id="year"
          required
          className="mb-4"
        />
        {formState.message && formState.type && (
          <Message type={formState.type} className="mb-4">
            {formState.message}
          </Message>
        )}
        <ButtonSubmit
          fullWidth
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          إنشاء حساب جديد
        </ButtonSubmit>
      </form>
      <Link href="/login">تسجيل الدخول</Link>
    </main>
  );
}
