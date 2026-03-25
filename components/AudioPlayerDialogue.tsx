"use client";

import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import Dialogue from "./Dialogue";
import { useOfflineMedia } from "@/lib/hooks/useOfflineMedia";
import { icons } from "./icons";
import ButtonIcon from "./ButtonIcon";
import Link from "next/link";

function AudioArt() {
  return (
    <div className="w-64 h-64 bg-cyan-100/50 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center shadow-inner">
      <div className="text-cyan-500/50 dark:text-cyan-400/50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-24"
        >
          <path
            fillRule="evenodd"
            d="M19.952 1.651a.75.75 0 0 1 .291.599V16.303a3 3 0 0 1-2.176 2.884l-4.693 1.34a3 3 0 0 1-3.75-2.883V5.433a.75.75 0 0 1 .533-.719l9.317-2.986a.75.75 0 0 1 .478-.077Z"
            clipRule="evenodd"
          />
          <path d="M7.749 6.276a.75.75 0 0 1 .477-.077l4.032.898A.75.75 0 0 1 12.75 7.82v8.483a3 3 0 0 1-2.176 2.884l-4.693 1.34a3 3 0 0 1-3.75-2.883V8.417a.75.75 0 0 1 .533-.718l5.085-1.423Z" />
        </svg>
      </div>
    </div>
  );
}

export default function AudioPlayerDialogue({
  url,
  title,
  id,
  linkId,
  onClose,
}: {
  url: string;
  title: React.ReactNode;
  id: string | number;
  linkId: number;
  onClose: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const soundRef = useRef<Howl | null>(null);
  const {
    resolvedUrl,
    isDownloaded,
    isLoading: isDownloading,
    download,
  } = useOfflineMedia(url, linkId);
  const activeUrl = resolvedUrl || url;

  const storageKey = `audio-${id}`;

  useEffect(() => {
    let savedInfo = null;
    try {
      savedInfo = localStorage.getItem(storageKey);
    } catch (e) {
      console.warn("localStorage access denied", e);
    }
    let initialSeek = 0;
    let initialSpeed = 1.0;
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        initialSeek = parsed.seek || 0;
        initialSpeed = parsed.speed || 1.0;
      } catch (e) {
        console.warn("Failed to parse saved media info", e);
      }
    }
    soundRef.current = new Howl({
      src: [activeUrl],
      html5: true,
      rate: initialSpeed,
      onload: () => {
        setDuration(soundRef.current?.duration() || 0);
        if (initialSeek > 0) {
          soundRef.current?.seek(initialSeek);
          setCurrentTime(initialSeek);
        }
        setSpeed(initialSpeed);
      },
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
      onseek: () => {
        const seek = soundRef.current?.seek();
        if (typeof seek === "number") setCurrentTime(seek);
      },
    });

    return () => {
      soundRef.current?.unload();
    };
  }, [activeUrl]);

  useEffect(() => {
    soundRef.current?.rate(speed);
  }, [speed]);

  useEffect(() => {
    let animationFrameId: number;
    const update = () => {
      if (soundRef.current && soundRef.current.playing()) {
        const seek = soundRef.current.seek();
        if (typeof seek === "number") {
          setCurrentTime(seek);
          try {
            localStorage.setItem(storageKey, JSON.stringify({ seek, speed }));
          } catch (e) {
            // ignore
          }
        }
      }
      animationFrameId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const seekRelative = (seconds: number) => {
    if (!soundRef.current) return;
    const current = soundRef.current.seek();
    if (typeof current === "number") {
      const newTime = Math.min(Math.max(current + seconds, 0), duration);
      soundRef.current.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    soundRef.current?.seek(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    return (currentTime / (duration || 100)) * 100;
  };

  return (
    <Dialogue
      header={title}
      onClose={onClose}
      size="sm"
      className="rounded-xl flex flex-col gap-4 p-4 items-center"
    >
      <AudioArt />
      <h2>{title}</h2>
      <div className="w-full space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          style={{
            background: `linear-gradient(to right, #06b6d4 ${calculateProgress()}%, #e2e8f0 ${calculateProgress()}%)`,
          }}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-cyan-500"
        />
        <div className="flex justify-between caption">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between w-full font-mono">
        <select
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="appearance-none w-10 text-xs font-bold py-1.5 bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center"
        >
          {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3].map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>
        <div className="flex flex-col items-center gap-1">
          <ButtonIcon
            icon="arrow-uturn-left-large"
            onClick={() => seekRelative(-10)}
          />
          <span className="text-xs">-10s</span>
        </div>
        <button
          onClick={togglePlay}
          className="size-12 bg-cyan-500 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? icons["pause"] : icons["play"]}
        </button>
        <div className="flex flex-col items-center gap-1">
          <ButtonIcon
            icon="arrow-uturn-right-large"
            onClick={() => seekRelative(10)}
          />
          <span className="text-xs">+10s</span>
        </div>
        <Link href={activeUrl} target="_blank" download>
          <ButtonIcon icon="folder" />
        </Link>
      </div>
    </Dialogue>
  );
}
