"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

interface VideoPlayerProps {
  src: string;
  chaptersSrc: string;
  title: string;
}

export default function VideoPlayer({
  src,
  chaptersSrc,
  title,
}: VideoPlayerProps) {
  return (
    <div className="w-full h-full">
      <MediaPlayer src={src} title={title} playsInline>
        <MediaProvider>
          <Track
            src={chaptersSrc}
            kind="chapters"
            lang="en-US"
            label="Chapters"
            default
          />
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}
