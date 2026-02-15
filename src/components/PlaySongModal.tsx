import React, { useEffect, useMemo, useRef, useState } from "react";
import { getClipBlob } from "../game/audioStore";

type Props = {
  open: boolean;
  number: number | null;
  onClose: () => void;
};

type Availability = "unknown" | "checking" | "found" | "missing";

async function fallbackAudioExists(url: string): Promise<boolean> {
  // We must NOT trust status alone (dev servers sometimes return index.html with 200)
  // so we verify Content-Type begins with "audio/"
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) return false;

    const ct = (res.headers.get("content-type") || "").toLowerCase();
    // Common: audio/mpeg, audio/mp3, audio/wav, etc.
    if (ct.startsWith("audio/")) return true;

    // If it’s HTML or something else, treat as missing
    return false;
  } catch {
    return false;
  }
}

export default function PlaySongModal({ open, number, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [availability, setAvailability] = useState<Availability>("unknown");

  const fallbackSrc = useMemo(() => {
    if (!number) return "";
    return `${import.meta.env.BASE_URL}audio/${number}.mp3`;
  }, [number]);

  function stopAndCleanup() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  // ✅ Check as soon as the popup opens / number changes
  useEffect(() => {
    let cancelled = false;

    async function checkAvailability() {
      if (!open || !number) return;

      setAvailability("checking");
      setStatus("idle");
      stopAndCleanup();

      // 1) IndexedDB (uploaded clips)
      const blob = await getClipBlob(number);
      if (cancelled) return;

      if (blob) {
        setAvailability("found");
        return;
      }

      // 2) Optional fallback: public/audio/<n>.mp3 (only if it’s реально audio)
      const ok = await fallbackAudioExists(fallbackSrc);
      if (cancelled) return;

      setAvailability(ok ? "found" : "missing");
    }

    if (open && number) {
      checkAvailability();
    } else {
      setAvailability("unknown");
      setStatus("idle");
      stopAndCleanup();
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, number, fallbackSrc]);

  async function play() {
    if (!number) return;

    try {
      setStatus("loading");
      stopAndCleanup();

      // Prefer uploaded clip
      const blob = await getClipBlob(number);

      let srcToPlay = "";
      if (blob) {
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        srcToPlay = url;
      } else {
        srcToPlay = fallbackSrc;
      }

      const a = new Audio(srcToPlay);
      a.preload = "auto";
      audioRef.current = a;

      a.onended = () => setStatus("idle");
      a.onerror = () => setStatus("error");

      await a.play();
      setStatus("playing");
    } catch {
      setStatus("error");
    }
  }

  if (!open || !number) return null;

  const showChecking = availability === "checking";
  const showFound = availability === "found";
  const showMissing = availability === "missing";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.70)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          background: "#0e141c",
          color: "#fff",
          borderRadius: 18,
          padding: 18,
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 18px 60px rgba(0,0,0,0.55)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontSize: 18 }}>
            Play song for <b>{number}</b>?
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#fff",
              borderRadius: 10,
              padding: "8px 10px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ fontSize: 72, fontWeight: 900, textAlign: "center", margin: "18px 0" }}>
          {number}
        </div>

        <button
          onClick={play}
          disabled={status === "loading" || status === "playing" || availability === "missing"}
          style={{
            width: "100%",
            fontSize: 24,
            fontWeight: 900,
            padding: "18px 14px",
            borderRadius: 16,
            border: "none",
            cursor:
              status === "loading" || status === "playing" || availability === "missing"
                ? "not-allowed"
                : "pointer",
            background: availability === "missing" ? "rgba(34,197,94,0.25)" : "#22c55e",
            color: "#07110a",
            marginBottom: 10
          }}
          title={availability === "missing" ? "No clip for this number yet" : ""}
        >
          {status === "loading" ? "LOADING..." : status === "playing" ? "PLAYING..." : "▶ PLAY SONG"}
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            fontSize: 16,
            padding: "12px 14px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "transparent",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>

        {showChecking && (
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1 }}>CHECKING…</div>
          </div>
        )}

        {showFound && (
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 16,
              border: "1px solid rgba(34,197,94,0.35)",
              background: "rgba(34,197,94,0.10)",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 1000, letterSpacing: 1 }}>SONG FOUND</div>
            <div style={{ marginTop: 6, fontSize: 14, opacity: 0.9 }}>
              Ready to play <b>{number}.mp3</b>
            </div>
          </div>
        )}

        {showMissing && (
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 16,
              border: "1px solid rgba(248,113,113,0.35)",
              background: "rgba(248,113,113,0.10)",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 1000, letterSpacing: 1 }}>NO SONG FOUND</div>
            <div style={{ marginTop: 6, fontSize: 14, opacity: 0.9 }}>
              Upload <b>{number}.mp3</b> using <b>Upload Song Clips</b>
            </div>
          </div>
        )}

        {status === "error" && (
          <div style={{ marginTop: 10, textAlign: "center", color: "#fca5a5", fontSize: 13 }}>
            Audio failed to play. Try re-exporting the mp3.
          </div>
        )}
      </div>
    </div>
  );
}
