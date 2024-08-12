"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { useState } from "react";

import { login } from "@/lib/actions";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import Input from "@/components/Input";
import AuthCard from "../components/AuthCard";

export default function LoginPage() {
  const [formState, formAction] = useFormState(login, {});
  const [hover, setHover] = useState(false);

  return (
    <AuthCard hover={hover}>
      <form action={formAction} className="w-full">
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
          تسجيل الدخول
        </ButtonSubmit>
      </form>
      <Link href="/signup">إنشاء حساب جديد</Link>
    </AuthCard>
  );
}
