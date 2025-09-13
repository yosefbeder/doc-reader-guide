import ButtonIcon from "@/components/ButtonIcon";
import { User as UserType } from "@/types";
import React from "react";
import { KeyedMutator } from "swr";
import UpdateUserForm, { ROLES } from "./UpdateUserForm";
import getHighlightedText from "@/utils/getHighlightedText";

export default function User({
  search,
  users,
  index,
  mutate,
  isUpdating,
  onUpdate,
}: {
  search: string;
  users: UserType[];
  index: number;
  mutate: KeyedMutator<any>;
  isUpdating: boolean;
  onUpdate: () => void;
}) {
  const user = users[index];
  return (
    <div className="floating col">
      <div className="flex items-center gap-2">
        <img
          src={user.picture}
          alt={`${user.givenName} ${user.familyName}`}
          className="size-12 rounded-full"
        />
        <div className="flex-1 truncate">
          <div>{getHighlightedText(user.email, search)}</div>
          {!isUpdating && (
            <div className="text-gray-500 text-sm">{ROLES[user.roleId]}</div>
          )}
        </div>
        <ButtonIcon
          icon={isUpdating ? "x-mark" : "pencil-square"}
          onClick={onUpdate}
        />
      </div>
      {isUpdating && (
        <UpdateUserForm users={users} index={index} mutate={mutate} />
      )}
    </div>
  );
}
