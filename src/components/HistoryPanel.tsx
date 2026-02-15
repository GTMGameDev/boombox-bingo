import React from "react";

export default function HistoryPanel({
  calledNumbers
}: {
  calledNumbers: number[];
}) {
  const lastTen = calledNumbers.slice(-10).reverse();

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.03)"
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 8 }}>History</div>

      <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 8 }}>
        Called: <b>{calledNumbers.length}</b> / 90
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {lastTen.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No numbers yet.</div>
        ) : (
          lastTen.map((n) => (
            <div
              key={n + "-" + calledNumbers.length}
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)"
              }}
            >
              {n}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
