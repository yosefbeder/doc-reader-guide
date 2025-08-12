"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import { User } from "@/types";
import { deleteUser, updateUser } from "@/lib/actions/users";
import Message from "@/components/Message";
import ButtonDelete from "@/components/ButtonDelete";
import { useUpdateDeleteForms } from "@/lib/hooks";
import Select from "@/components/Select";
import { KeyedMutator } from "swr";

export const ROLES = ["Founder", "Super admin", "Admin", "User"];

export default function UpdateUserForm({
  users,
  index,
  mutate,
}: {
  users: User[];
  index: number;
  mutate: KeyedMutator<any>;
}) {
  const user = users[index];
  const [roleId, setRoleId] = useState(user.roleId);
  const [updateFormState, updateFormAction] = useFormState(updateUser, {});
  const updateFormId = `update-user-${user.id}`;
  const [deleteFormState, deleteFormAction] = useFormState(deleteUser, {});
  const formRef = useRef(null);
  const { hideMessage, setHideMessage } = useUpdateDeleteForms(
    updateFormState,
    deleteFormState
  );

  useEffect(() => {
    if (updateFormState?.type === "success")
      mutate({
        users: users.map((user, i) => {
          if (i === index) {
            return { ...user, roleId };
          } else return user;
        }),
      });
  }, [updateFormState.resetKey]);

  useEffect(() => {
    if (deleteFormState?.type === "success")
      mutate({ users: users.filter((user, i) => index !== i) });
  }, [deleteFormState]);

  return (
    <div onClickCapture={() => setHideMessage(true)}>
      <input
        type="number"
        name="user-id"
        defaultValue={user.id}
        className="hidden"
        form={updateFormId}
      />

      <Select
        label="Role"
        icon="lock-closed"
        name="role-id"
        id={`user-${user.id}-role-id`}
        options={ROLES.map((role, index) => ({ label: role, value: index }))}
        required
        value={roleId}
        onChange={(e) => setRoleId(Number(e.target.value))}
        className="mb-4"
        form={updateFormId}
      />
      {updateFormState.message && updateFormState.type && !hideMessage && (
        <Message type={updateFormState.type} className="mb-4">
          {updateFormState.message}
        </Message>
      )}
      {deleteFormState.message && deleteFormState.type && !hideMessage && (
        <Message type={deleteFormState.type} className="mb-4">
          {deleteFormState.message}
        </Message>
      )}
      <div className="flex gap-2">
        <form action={updateFormAction} className="inline" id={updateFormId}>
          <ButtonSubmit color="yellow">Update</ButtonSubmit>
        </form>
        <form action={deleteFormAction} className="inline" ref={formRef}>
          <input
            type="number"
            name="user-id"
            defaultValue={user.id}
            className="hidden"
          />
          <ButtonDelete
            confirmationText={user.id.toString()}
            formRef={formRef}
          />
        </form>
      </div>
    </div>
  );
}
