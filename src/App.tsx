import React from "react";
import { useBingoGame } from "./game/useBingoGame";
import NumberBall from "./components/NumberBall";
import PlaySongModal from "./components/PlaySongModal";
import SaveBar from "./components/SaveBar";
import HistoryPanel from "./components/HistoryPanel";
import UploadSongClipsButton from "./components/UploadSongClipsButton";

export default function App() {
  const { save, modalOpen, setModalOpen, isFinished, callNextNumber, resetGame, setSaveName } = useBingoGame();

  const gameLogoSrc = `${import.meta.env.BASE_URL}branding/game-logo.png`;
  const gtmLogoSrc = `${import.meta.env.BASE_URL}branding/gtm-logo.png`;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      {/* TOP BAR */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "start" }}>
        <SaveBar saveName={save.saveName} updatedAtISO={save.updatedAtISO} onRename={setSaveName} />

        <a
          href="/viewer"
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "transparent",
            color: "#fff",
            fontWeight: 900,
            textDecoration: "none",
            textAlign: "center"
          }}
        >
          Open Viewer Screen
        </a>

        <UploadSongClipsButton />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 12,
          alignItems: "start",
          marginTop: 12
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            padding: 14,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
            minHeight: 640
          }}
        >
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <NumberBall value={save.currentNumber} />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 14, opacity: 0.85 }}>Current number</div>
              <div style={{ fontSize: 40, fontWeight: 900 }}>{save.currentNumber ?? "—"}</div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                <button
                  onClick={callNextNumber}
                  disabled={isFinished}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "none",
                    background: isFinished ? "rgba(255,255,255,0.10)" : "#60a5fa",
                    color: "#06101b",
                    cursor: isFinished ? "not-allowed" : "pointer",
                    fontWeight: 900,
                    fontSize: 16
                  }}
                >
                  {isFinished ? "Finished" : "Call Next Number"}
                </button>

                <button
                  onClick={() => setModalOpen(true)}
                  disabled={!save.currentNumber}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "transparent",
                    color: "#fff",
                    cursor: save.currentNumber ? "pointer" : "not-allowed",
                    fontWeight: 800,
                    fontSize: 16
                  }}
                >
                  Play Song Popup
                </button>

                <button
                  onClick={() => {
                    const first = window.confirm("Reset game?");
                    if (!first) return;
                    const second = window.confirm("ARE YOU SURE?");
                    if (!second) return;
                    resetGame();
                  }}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 16
                  }}
                >
                  Reset game
                </button>
              </div>

              {isFinished && (
                <div
                  style={{
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid rgba(34,197,94,0.35)",
                    background: "rgba(34,197,94,0.12)",
                    fontWeight: 800
                  }}
                >
                  ✅ All 90 numbers have been called. Game finished!
                </div>
              )}
            </div>
          </div>

          {/* BIG GAME LOGO */}
          <div style={{ marginTop: 18, height: 260, display: "grid", placeItems: "center" }}>
            <img
              src={gameLogoSrc}
              alt="Game Logo"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.55))"
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <HistoryPanel calledNumbers={save.calledNumbers} />

          {/* INSTRUCTIONS */}
          <div
            style={{
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)"
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Instructions</div>
            <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.45 }}>
              • Upload clips named 1.mp3 to 90.mp3
              <br />
              • Click Call Next Number
              <br />
              • Click Play Song
              <br />
              • Use Viewer Screen for TV display
            </div>
          </div>

          {/* Viewer Preview label */}
          <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.8, marginTop: 2 }}>Viewer Preview</div>

          {/* MINI VIEWER (PiP) */}
          <div
            style={{
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
            }}
          >
            <iframe
              src="/viewer"
              title="Viewer Preview"
              style={{
                width: "100%",
                height: 200,
                border: "none",
                background: "#000"
              }}
            />
          </div>

          {/* GTM LOGO - directly under PiP, small */}
          <div style={{ height: 100, display: "grid", placeItems: "center", marginTop: 4 }}>
            <img
              src={gtmLogoSrc}
              alt="GTM Game Dev"
              style={{
                width: "56%", // smaller than before
                height: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.55))"
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      </div>

      <PlaySongModal open={modalOpen} number={save.currentNumber} onClose={() => setModalOpen(false)} />
    </div>
  );
}
