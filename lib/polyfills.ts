"use client";

if (typeof Promise.withResolvers === "undefined") {
  Promise.withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function (compareFn) {
    return [...this].sort(compareFn as any);
  };
}

if (typeof URL !== "undefined" && typeof (URL as any).parse === "undefined") {
  (URL as any).parse = function (url: string | URL, base?: string | URL) {
    try {
      return new URL(url, base);
    } catch {
      return null;
    }
  };
}
