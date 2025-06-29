"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { useState } from "react";

import { login } from "@/lib/actions";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import Input from "@/components/Input";
import AuthCard from "../components/AuthCard";
import InputPassword from "@/components/InputPassword";

export default function LoginPage() {
  const [formState, formAction] = useFormState(login, {});
  const [hover, setHover] = useState(false);

  return (
    <AuthCard hover={hover} title="Log in">
      <form action={formAction} className="w-full">
        <Input
          label="Email"
          icon="envelope"
          type="email"
          name="email"
          id="email"
          required
          className="mb-4"
        />
        <InputPassword
          label="Password"
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
          Log in
        </ButtonSubmit>
      </form>
      <p>
        Don&apos;t have an account? →{" "}
        <Link href="/signup">Create a new account</Link>
      </p>
    </AuthCard>
  );
}
