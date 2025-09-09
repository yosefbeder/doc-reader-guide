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
let flush: any;

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
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
      (async () => {
        const all = await drainBatch(1000);
        if (all.length === 0) return;
        const payloadObj = { events: all.map((e: any) => e.payload || e) };
        const payload = JSON.stringify(payloadObj);
        let failed = false;
        try {
          if (navigator.sendBeacon) {
            const ok = navigator.sendBeacon(
              `${process.env.NEXT_PUBLIC_API_URL}/events/bulk`,
              new Blob([payload], { type: "application/json" })
            );
            if (!ok) failed = true;
          } else {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/events/bulk`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: payload,
                keepalive: true,
              }
            );
            if (!res.ok) failed = true;
          }
        } catch (err) {
          failed = true;
        }
        if (failed) {
          // Usually doesn't get executed
          const db = await dbPromise;
          for (const e of all) {
            await db.add(STORE, e);
          }
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
  return localStorage.getItem("device-id") || null;
}
async function getUserId() {
  try {
    let stored = localStorage.getItem("user-id");
    let userId;
    if (stored) {
      userId = Number(stored);
    } else {
      const user = await getUser();
      if (user) {
        userId = user.id;
        localStorage.setItem("user-id", userId.toString());
      }
    }
    return userId;
  } catch (err) {
    console.error(err);
    return null;
  }
}
