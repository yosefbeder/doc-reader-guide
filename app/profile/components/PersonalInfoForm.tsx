"use client";

import { useFormState } from "react-dom";

import { updatePersonalInfo } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import { User } from "@/types";

export default function PersonalInfoForm({ user }: { user: User }) {
  const [fromState, formAction] = useFormState(updatePersonalInfo, {});

  return (
    <>
      {fromState?.message && <p>{fromState.message}</p>}
      <form action={formAction}>
        <label htmlFor="name">اسم المستخدم</label>
        <input type="text" name="name" id="name" defaultValue={user.name} />
        <label htmlFor="email">البريد الإلكتروني</label>
        <input type="email" name="email" id="email" defaultValue={user.email} />
        <SubmitButton>تعديل</SubmitButton>
        <label htmlFor="faculty">الكلية</label>
        <select
          name="faculty"
          id="faculty"
          disabled
          defaultValue={user.facultyId}
        >
          <option value={1}>كلية الطب جامعة الأزهر دمياط الجديدة</option>
          <option value={2}>القصر العيني جامعة القاهرة</option>
          <option value={3}>كلية الطب جامعة عين شمس</option>
        </select>
        <label htmlFor="year">السنة الدراسية</label>
        <select name="year" id="year" disabled defaultValue={user.yearId}>
          <option value={1}>الأولى</option>
          <option value={2}>الثانية</option>
          <option value={3}>الثالثة</option>
          <option value={4}>الرابعة</option>
          <option value={5}>الخامسة</option>
        </select>
      </form>
    </>
  );
}
