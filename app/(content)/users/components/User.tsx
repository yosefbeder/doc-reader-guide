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
    <div className="col rounded-xl p-2 layer-1">
      <div className="flex items-center gap-2">
        <img
          src={user.picture}
          alt={`${user.givenName} ${user.familyName}`}
          className="size-12 rounded-full"
        />
        <div className="flex-1 truncate">
          <div>{getHighlightedText(user.email, search)}</div>
          {!isUpdating && (
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {ROLES[user.roleId]}
            </p>
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
