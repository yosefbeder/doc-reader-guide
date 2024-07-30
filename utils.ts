import { decode } from "jsonwebtoken";
import { User } from "./types";

export function getUser(jwt: string): User {
  const { payload } = decode(jwt, { complete: true }) as { payload: any };
  delete payload.iat;
  payload.createdAt = new Date(payload.createdAt);
  payload.updatedAt = new Date(payload.updatedAt);
  return payload;
}
