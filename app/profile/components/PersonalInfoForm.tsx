"use client";

import { useFormState } from "react-dom";

import { updatePersonalInfo } from "@/lib/actions";
import ButtonSubmit from "@/components/ButtonSubmit";
import { User } from "@/types";
import Input from "@/components/Input";
import Message from "@/components/Message";
import Select from "@/components/Select";

export default function PersonalInfoForm({ user }: { user: User }) {
  const [formState, formAction] = useFormState(updatePersonalInfo, {});

  return (
    <form action={formAction} className="max-w-lg">
      <Input
        label="اسم المستخدم"
        icon="user"
        type="text"
        name="name"
        id="name"
        required
        defaultValue={user.name}
        className="mb-4"
      />
      <Input
        label="البريد الإلكتروني"
        icon="envelope"
        type="email"
        name="email"
        id="email"
        required
        defaultValue={user.email}
        className="mb-4"
      />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit className="w-max px-4 mb-4">تعديل</ButtonSubmit>
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
        defaultValue={user.facultyId}
        disabled
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
        defaultValue={user.yearId}
        disabled
        className="mb-4"
      />
    </form>
  );
}
