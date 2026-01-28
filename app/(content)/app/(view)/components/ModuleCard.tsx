"use client";

import Link from "next/link";
import Image from "next/image";
import { Action, Module, Resource } from "@/types";
import { logEvent } from "@/lib/event-logger";
import useOfflineModule from "@/hooks/useOfflineModule";
import ButtonIcon from "@/components/ButtonIcon";

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const { id, name, icon } = module;
  const { isOffline, isDownloading, download, remove } = useOfflineModule(id);

  return (
    <div className="relative group">
      <Link
        href={`/modules/${id}`}
        className="card layer-1 block"
        onClick={() => logEvent(Resource.MODULE, id, Action.NAVIGATE, {})}
      >
        <span>
          <Image
            className="dark:invert dark:brightness-200"
            src={icon}
            alt={name}
            width={48}
            height={48}
          />
        </span>
        <h2>{name}</h2>
      </Link>
      <div className="absolute top-2 right-2">
        <ButtonIcon
          icon={isOffline ? "trash" : "arrow-down-tray"}
          disabled={isDownloading}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isDownloading) return;
            if (isOffline) {
              const confirm = window.confirm(
                "Remove offline data for this module?"
              );
              if (confirm) remove();
            } else {
              download();
            }
          }}
        />
      </div>
    </div>
  );
}
