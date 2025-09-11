import Cookies from "js-cookie";
import { openDB } from "idb";

import { Action, Resource } from "@/types";
import getUser from "@/utils/getUserClient";

const DB_NAME = "app_events_v1";
const STORE = "events";
const FLUSH_INTERVAL = 15000;
const FLUSH_BATCH = 50;

let dbPromise: any;
let enqueue: any;
let drainBatch: any;
export let flush: any;

if (typeof window !== "undefined") {
  dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    },
  });

  enqueue = async function (event: any) {
    if (process.env.NODE_ENV !== "production") return;
    const db = await dbPromise;
    await db.add(STORE, event);
  };

  drainBatch = async function (max = FLUSH_BATCH) {
    const db = await dbPromise;
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const items: any[] = [];
    let cursor = await store.openCursor();
    while (cursor && items.length < max) {
      items.push({ _id: cursor.primaryKey, ...cursor.value });
      cursor = await cursor.continue();
    }
    for (const it of items) {
      await store.delete(it._id);
    }
    await tx.done;
    return items.map((i) => i);
  };

  flush = async function () {
    const batch = await drainBatch();
    if (batch.length === 0) return;
    const payload = { events: batch.map((e: any) => e.payload || e) };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/bulk`,
        {
          method: "POST",
          ...(Cookies.get("guest")
            ? {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
                },
              }
            : {
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              }),
          body: JSON.stringify(payload),
          keepalive: true,
        }
      );
      if (!res.ok) throw new Error();
    } catch (err) {
      for (const e of batch) {
        const db = await dbPromise;
        await db.add(STORE, e);
      }
    }
  };

  setInterval(() => {
    flush();
  }, FLUSH_INTERVAL);

  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // navigator.sendBeacon can't assign headers
      if (Cookies.get("guest")) return;
      (async () => {
        const all = await drainBatch(1000);
        if (all.length === 0) return;
        const payloadObj = { events: all.map((e: any) => e.payload || e) };
        const payload = JSON.stringify(payloadObj);
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            `${process.env.NEXT_PUBLIC_API_URL}/events/bulk`,
            new Blob([payload], { type: "application/json" })
          );
        } else {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/bulk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: payload,
            keepalive: true,
          });
        }
      })();
    }
  });
}

export async function logEvent(
  resource: Resource | null,
  resourceId: number | null,
  action: Action,
  payload: object
) {
  if (typeof window === "undefined" || !enqueue) return;
  const env = {
    resource,
    resourceId,
    action,
    payload,
    createdAt: new Date().toISOString(),
    sessionId: getSessionId(),
    deviceId: getDeviceId(),
    userId: await getUserId(),
    ip: "",
    userAgent: navigator.userAgent,
  };
  await enqueue({ payload: env });
}

function getSessionId() {
  try {
    let s = sessionStorage.getItem("session-id");
    if (!s) {
      s = crypto.randomUUID();
      sessionStorage.setItem("session-id", s);
    }
    return s;
  } catch {
    return null;
  }
}

function getDeviceId() {
  const stored = localStorage.getItem("device-id");
  if (stored) return Number(stored);
  return null;
}
async function getUserId() {
  if (Cookies.get("guest")) return null;
  try {
    const stored = localStorage.getItem("user-id");
    if (stored) return Number(stored);
    const user = await getUser();
    if (user) {
      localStorage.setItem("user-id", user.id.toString());
      return user.id;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
