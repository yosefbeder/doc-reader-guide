import { useEffect, useRef } from "react";

export function useSound(url: string) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Fetch + decode once
    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((decoded) => {
        bufferRef.current = decoded;
      });

    // On iOS Safari, must unlock context on gesture
    const unlock = () => {
      if (ctx.state === "suspended") {
        ctx.resume();
      }
    };
    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("click", unlock, { once: true });

    return () => {
      ctx.close();
    };
  }, [url]);

  // play function
  return () => {
    const ctx = audioCtxRef.current;
    const buffer = bufferRef.current;
    if (ctx && buffer) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0); // plays instantly, no delay
    }
  };
}
