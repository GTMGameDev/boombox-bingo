import React, { useRef, useState } from "react";
import { putClip } from "../game/audioStore";

function extractNumber(filename: string): number | null {
  // accepts "36.mp3" or "36 something.mp3"
  const m = filename.match(/^(\d{1,2})\b/);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n < 1 || n > 90) return null;
  return n;
}

export default function UploadSongClipsButton() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function onPickFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setBusy(true);
    setMsg("");

    let saved = 0;
    let skipped = 0;

    try {
      for (const f of Array.from(files)) {
        const n = extractNumber(f.name);
        if (!n) {
          skipped++;
          continue;
        }
        // store as blob
        await putClip(n, f);
        saved++;
      }

      setMsg(saved > 0 ? `Uploaded ${saved} clip(s).` : "No valid files found (name them 1.mp3 ... 90.mp3).");
      if (skipped > 0) setMsg((prev) => `${prev} Skipped ${skipped}.`);
    } catch {
      setMsg("Upload failed. Try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/mp3"
        multiple
        style={{ display: "none" }}
        onChange={(e) => onPickFiles(e.target.files)}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "none",
          background: "#22c55e",
          color: "#06110a",
          cursor: busy ? "not-allowed" : "pointer",
          fontWeight: 900
        }}
        title="Upload mp3 clips named 1.mp3 ... 90.mp3"
      >
        {busy ? "Uploading..." : "Upload Song Clips"}
      </button>

      {msg && <div style={{ fontSize: 12, opacity: 0.85 }}>{msg}</div>}
    </div>
  );
}
