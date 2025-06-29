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
    <AuthCard hover={hover} title="Sign up">
      <form action={formAction} className="w-full">
        <Input
          label="Name"
          icon="user"
          type="text"
          name="name"
          id="name"
          required
          className="mb-4"
        />
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
        <InputPassword
          label="Confirm password"
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
          Sign up
        </ButtonSubmit>
      </form>
      <p>
        Already have an account? → <Link href="/login">Log in</Link>
      </p>
    </AuthCard>
  );
}
