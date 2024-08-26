"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";

import Input from "@/components/Input";
import AuthCard from "../../components/AuthCard";
import SelectFacultyYear from "@/components/SelectFacultyYear";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Faculty } from "@/types";
import { signup } from "@/lib/actions";
import InputPassword from "@/components/InputPassword";

export default function SignupForm({ faculties }: { faculties: Faculty[] }) {
  const [formState, formAction] = useFormState(signup, {});
  const [hover, setHover] = useState(false);

  return (
    <AuthCard hover={hover}>
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
        <InputPassword
          label="كلمة المرور"
          name="password"
          id="password"
          required
          className="mb-4"
        />
        <InputPassword
          label="تأكيد كلمة المرور"
          name="confirmation-password"
          id="confirmation-password"
          required
          className="mb-4"
        />
        <SelectFacultyYear faculties={faculties} />
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
    </AuthCard>
  );
}
