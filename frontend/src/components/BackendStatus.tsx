"use client";

import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL, getHealth, type HealthResponse } from "@/lib/api";

type State =
  | { phase: "loading" }
  | { phase: "ok"; data: HealthResponse }
  | { phase: "error"; message: string };

export default function BackendStatus() {
  const [state, setState] = useState<State>({ phase: "loading" });

  const check = useCallback(async () => {
    setState({ phase: "loading" });
    try {
      setState({ phase: "ok", data: await getHealth() });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      setState({ phase: "error", message });
    }
  }, []);

  useEffect(() => {
    // Run the check once when the page opens. The state updates happen after
    // the network call finishes, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void check();
  }, [check]);

  return (
    <section
      aria-live="polite"
      className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Backend connection</h2>
        <button
          onClick={check}
          disabled={state.phase === "loading"}
          className="rounded border border-[var(--line)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--wash)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-50"
        >
          Check again
        </button>
      </div>

      {state.phase === "loading" && (
        <p className="mt-4 text-[var(--muted)]">Contacting {API_BASE_URL} …</p>
      )}

      {state.phase === "ok" && (
        <>
          <p className="mt-4 font-medium text-[var(--ok)]">
            Connected. The frontend reached the backend.
          </p>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <Row label="Service" value={state.data.service} />
            <Row label="Version" value={state.data.version} />
            <Row label="Environment" value={state.data.environment} />
            <Row label="Server time (UTC)" value={state.data.server_time_utc} />
            <Row
              label="ffmpeg"
              value={state.data.tools.ffmpeg ?? "not installed"}
              warn={!state.data.tools.ffmpeg}
            />
            <Row
              label="ffprobe"
              value={state.data.tools.ffprobe ?? "not installed"}
              warn={!state.data.tools.ffprobe}
            />
          </dl>
          {(!state.data.tools.ffmpeg || !state.data.tools.ffprobe) && (
            <p className="mt-4 text-sm text-[var(--warn)]">
              ffmpeg is not installed on the backend machine. It is not needed
              yet, but the video pipeline (Milestone 5) requires it.
            </p>
          )}
        </>
      )}

      {state.phase === "error" && (
        <div className="mt-4 text-sm">
          <p className="font-medium text-[var(--bad)]">
            Could not reach the backend at {API_BASE_URL}.
          </p>
          <p className="mt-1 text-[var(--muted)]">Details: {state.message}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Is the backend running? Start it from the backend folder.</li>
            <li>
              Is the address right? Check NEXT_PUBLIC_API_URL in
              frontend/.env.local, then restart the frontend.
            </li>
            <li>
              Browser console mentions CORS? Add this site&rsquo;s address to
              CORS_ORIGINS in backend/.env and restart the backend.
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}

function Row({
  label,
  value,
  warn = false,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <>
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd
        className={`break-all font-mono ${warn ? "text-[var(--warn)]" : ""}`}
      >
        {value}
      </dd>
    </>
  );
}
