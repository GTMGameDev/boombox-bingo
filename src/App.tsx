import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Viewer from "./pages/Viewer";

import SaveBar from "./components/SaveBar";
import HistoryPanel from "./components/HistoryPanel";
import PlaySongModal from "./components/PlaySongModal";
import UploadSongClipsButton from "./components/UploadSongClipsButton";
import NumberBall from "./components/NumberBall";
import { useBingoGame } from "./game/useBingoGame";

function HostScreen() {
  const game = useBingoGame();
  const { save, modalOpen, setModalOpen, isFinished, callNextNumber, resetGame, setSaveName } =
    game;

  React.useEffect(() => {
    document.title = "Boombox Bingo";
  }, []);

  const base = import.meta.env.BASE_URL || "/";
  const baseNorm = base.endsWith("/") ? base : `${base}/`;

  const viewerHref = React.useMemo(() => {
    return new URL(`${baseNorm}viewer`, window.location.origin).toString();
  }, [baseNorm]);

  const openViewer = () => {
    window.open(viewerHref, "_blank", "noopener,noreferrer");
  };

  const onReset = () => {
    const first = window.confirm("Reset game? This will wipe the save and called numbers.");
    if (!first) return;
    const second = window.confirm("ARE YOU SURE? This cannot be undone.");
    if (!second) return;
    resetGame();
  };

  const current = save.currentNumber;

  const gameLogoSrc = `${baseNorm}branding/game-logo.png`;
  const gtmLogoSrc = `${baseNorm}branding/gtm-logo.png`;

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f14", color: "#e8eef7", padding: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          padding: 14,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.03)",
          marginBottom: 16,
        }}
      >
        <SaveBar saveName={save.saveName} updatedAtISO={save.updatedAtISO} onRename={setSaveName} />

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={openViewer}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "transparent",
              color: "#e8eef7",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Open Viewer Screen
          </button>

          <UploadSongClipsButton />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16 }}>
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
            padding: 16,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 18 }}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <NumberBall value={current ?? null} />
            </div>

            <div>
              <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 6 }}>Current number</div>
              <div style={{ fontSize: 44, fontWeight: 1000, marginBottom: 12 }}>
                {current ?? "—"}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={callNextNumber}
                  disabled={isFinished}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(59,130,246,0.45)",
                    background: isFinished ? "rgba(59,130,246,0.15)" : "#60a5fa",
                    color: "#04101f",
                    fontWeight: 900,
                    cursor: isFinished ? "not-allowed" : "pointer",
                  }}
                >
                  Call Next Number
                </button>

                <button
                  onClick={() => setModalOpen(true)}
                  disabled={!current}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "transparent",
                    color: "#e8eef7",
                    fontWeight: 900,
                    cursor: !current ? "not-allowed" : "pointer",
                    opacity: !current ? 0.6 : 1,
                  }}
                >
                  Play Song Popup
                </button>
              </div>

              <div style={{ marginTop: 10 }}>
                <button
                  onClick={onReset}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "transparent",
                    color: "#e8eef7",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Reset game
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 22, display: "grid", placeItems: "center" }}>
            <img
              src={gameLogoSrc}
              alt="Boombox Bingo"
              draggable={false}
              style={{
                width: "min(880px, 92%)",
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 18px 45px rgba(0,0,0,0.65))",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <HistoryPanel calledNumbers={save.calledNumbers} />

          <div
            style={{
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Instructions</div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, opacity: 0.9 }}>
              <li>Upload clips named 1.mp3 to 90.mp3</li>
              <li>Click Call Next Number</li>
              <li>Click Play Song</li>
              <li>Use Viewer Screen for TV display</li>
            </ul>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Viewer Preview</div>

            <div
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
              }}
            >
              <iframe
                title="Viewer Preview"
                src={viewerHref}
                style={{ width: "100%", height: 240, border: "none", display: "block" }}
              />
            </div>

            <div style={{ marginTop: 10, display: "grid", placeItems: "center" }}>
              <img
                src={gtmLogoSrc}
                alt="GTM Game Dev"
                draggable={false}
                style={{ maxWidth: 220, width: "70%", height: "auto", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>

      <PlaySongModal open={modalOpen} number={current} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HostScreen />} />
      <Route path="/viewer" element={<Viewer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
