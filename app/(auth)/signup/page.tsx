"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";

import { signup } from "@/lib/actions";
import ButtonSubmit from "@/components/ButtonSubmit";
import Message from "@/components/Message";
import Input from "@/components/Input";
import SelectFacultyYear from "@/components/SelectFacultyYear";
import AuthCard from "../components/AuthCard";

export default function SignupPage() {
  const [formState, formAction] = useFormState(signup, {});
  const [hover, setHover] = useState(false);
  const [fetching, setFetching] = useState(true);

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
        <SelectFacultyYear fetching={fetching} setFetching={setFetching} />
        {formState.message && formState.type && (
          <Message type={formState.type} className="mb-4">
            {formState.message}
          </Message>
        )}
        <ButtonSubmit
          fullWidth
          disabled={fetching}
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
