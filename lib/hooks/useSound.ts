import { Howl } from "howler";

export function useSound(url: string) {
  const sound = new Howl({
    src: [url],
    html5: false,
  });

  return () => {
    sound.play();
  };
}
