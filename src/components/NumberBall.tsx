import React from "react";

export default function NumberBall({ value }: { value: number | null }) {
  return (
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: 999,
        background: "radial-gradient(circle at 30% 30%, #1f2937, #06080c)",
        border: "2px solid rgba(255,255,255,0.12)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        userSelect: "none"
      }}
    >
      <div style={{ fontSize: 84, fontWeight: 900, letterSpacing: 1 }}>
        {value ?? "—"}
      </div>
    </div>
  );
}
