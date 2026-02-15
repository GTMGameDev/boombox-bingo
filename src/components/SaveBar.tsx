import React, { useState } from "react";

export default function SaveBar({
  saveName,
  updatedAtISO,
  onRename
}: {
  saveName: string;
  updatedAtISO: string;
  onRename: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(saveName);

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.03)"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontWeight: 800 }}>
          Save:{" "}
          {!editing ? (
            <span>{saveName}</span>
          ) : (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={{
                marginLeft: 6,
                padding: "6px 8px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(0,0,0,0.25)",
                color: "#fff"
              }}
            />
          )}
        </div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Autosaved: {new Date(updatedAtISO).toLocaleString()}
        </div>
      </div>

      {!editing ? (
        <button
          onClick={() => {
            setDraft(saveName);
            setEditing(true);
          }}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "transparent",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700
          }}
        >
          Rename
        </button>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              onRename(draft);
              setEditing(false);
            }}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "none",
              background: "#60a5fa",
              color: "#05101d",
              cursor: "pointer",
              fontWeight: 900
            }}
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
