import React, { useEffect, useMemo, useState } from "react";
import type { SaveData } from "../game/types";

const KEY = "bingo_host_save_v1";

function readSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    if (!parsed || parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function Viewer() {
  const [save, setSave] = useState<SaveData | null>(() => readSave());

  const gameLogoSrc = useMemo(() => `${import.meta.env.BASE_URL}branding/game-logo.png`, []);

  useEffect(() => {
    // Update when host changes localStorage (same device)
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSave(readSave());
    };
    window.addEventListener("storage", onStorage);

    // Update on same tab/device too (polling makes it feel "live")
    const t = window.setInterval(() => setSave(readSave()), 300);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(t);
    };
  }, []);

  const current = save?.currentNumber ?? null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0f14",
        color: "#e8eef7",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        padding: 24
      }}
    >
      {/* Logo */}
      <div style={{ display: "grid", placeItems: "center" }}>
        <img
          src={gameLogoSrc}
          alt="Game Logo"
          style={{
            maxWidth: "min(900px, 92vw)",
            maxHeight: "22vh",
            objectFit: "contain",
            filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.6))"
          }}
        />
      </div>

      {/* Big Ball */}
      <div style={{ display: "grid", placeItems: "center" }}>
        <div
          style={{
            width: "min(62vh, 85vw)",
            height: "min(62vh, 85vw)",
            borderRadius: 9999,
            background: "radial-gradient(circle at 30% 30%, #1f2937, #05070a)",
            border: "2px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.65)",
            display: "grid",
            placeItems: "center",
            userSelect: "none"
          }}
        >
          <div style={{ fontSize: "min(22vh, 26vw)", fontWeight: 1000, letterSpacing: 2 }}>
            {current ?? "—"}
          </div>
        </div>

        <div style={{ marginTop: 18, opacity: 0.7, fontSize: 14 }}>
          {save?.saveName ? `Game: ${save.saveName}` : ""}
        </div>
      </div>
    </div>
  );
}
