import { User } from "@/types";

export default function notUpdateable(user: User, creatorId?: number) {
  return user.roleId === 2 && user.id !== creatorId;
}
