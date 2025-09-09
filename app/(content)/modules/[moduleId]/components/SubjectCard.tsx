"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { logEvent } from "@/lib/event-logger";
import { Action, Resource, Subject } from "@/types";

export default function SubjectCard({
  subject: {
    id,
    name,
    icon,
    _count: { lectures },
  },
}: {
  subject: Subject;
}) {
  return (
    <Link
      href={`/subjects/${id}`}
      className="card relative group"
      onClick={() => logEvent(Resource.SUBJECT, id, Action.NAVIGATE, {})}
    >
      <span>
        <Image src={icon} alt={name} width={48} height={48} />
      </span>
      <h3>{name}</h3>
      <div className="flex gap-2 items-center absolute left-0 top-0 p-2 rounded-tl-xl rounded-br-xl bg-cyan-600 text-white font-bold text-sm">
        {lectures}{" "}
        <span className="hidden group-hover:inline">
          LECTURE{lectures > 1 && "S"}
        </span>
      </div>
    </Link>
  );
}
