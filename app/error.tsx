"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ErrorBoundary caught:", error);
  }, [error]);

  const deserializeError = (err: any) => {
    if (!err) return "No error object provided";

    if (!(err instanceof Error)) {
      try {
        return JSON.stringify(err, null, 2);
      } catch (e) {
        return String(err);
      }
    }

    const errorState: Record<string, any> = {};
    Object.getOwnPropertyNames(err).forEach((key) => {
      errorState[key] = (err as any)[key];
    });

    return JSON.stringify(errorState, null, 2);
  };

  const copyToClipboard = () => {
    const text = deserializeError(error);
    navigator.clipboard.writeText(text);
    toast.success("Error details copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-slate-800 font-sans">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg overflow-hidden border border-red-100">
        <div className="bg-red-500 p-4 flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-lg font-bold text-white">
            Application Crash Report
          </h2>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-red-600 border border-white/30 text-white font-semibold rounded shadow hover:bg-red-700 transition-colors text-sm"
            >
              Copy Error
            </button>
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-white text-red-600 font-semibold rounded shadow hover:bg-red-50 transition-colors text-sm"
            >
              Attempt Recovery
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="mb-4 text-sm text-slate-600">
            The application encountered an unexpected client-side error. Below
            is the deserialized error payload.
          </p>

          <div className="bg-slate-900 rounded-md p-4 overflow-x-auto">
            <pre className="text-green-400 font-mono text-sm leading-relaxed">
              <code>{deserializeError(error)}</code>
            </pre>
          </div>

          {error.digest && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
              <strong>Next.js Error Digest:</strong> {error.digest}
              <br />
              <span className="text-xs opacity-80">
                Search for this hash in your Vercel logs to find the
                corresponding server-side footprint.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
