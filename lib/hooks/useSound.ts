import { useEffect } from "react";

declare global {
  interface Window {
    lowLag: any;
  }
}

export function useSound(url: string) {
  useEffect(() => {
    if (!window.lowLag) return;
    window.lowLag.init({ forceAudio: "audioTag" });
    window.lowLag.load(url, url);
  }, [url]);

  return () => {
    window.lowLag?.play(url);
  };
}
