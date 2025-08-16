import { useCallback } from "react";

export function useSound(path: string) {
  return useCallback(() => {
    const audio = new Audio(path);
    audio.play().catch(() => {});
  }, [path]);
}
