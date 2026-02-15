import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Viewer from "./pages/Viewer";
import "./App.css";

// --- your existing imports (keep these if you already have them) ---
import SaveBar from "./components/SaveBar";
import HistoryPanel from "./components/HistoryPanel";
import PlaySongModal from "./components/PlaySongModal";
import UploadSongClipsButton from "./components/UploadSongClipsButton";
import NumberBall from "./components/NumberBall";
import { useBingoGame } from "./game/useBingoGame";

// If you have extra CSS file names (styles.css etc) keep your existing ones too.
// Example: import "./styles.css";

function HostScreen() {
  // Keep your existing game hook/state logic here
  const game = useBingoGame();

  React.useEffect(() => {
    document.title = "Boombox Bingo";
  }, []);

  // ---- If your current App.tsx already has UI layout, paste it inside here ----
  // The code below is a safe host layout that matches your screenshots:
  const {
    state,
    callNextNumber,
    openPlayModal,
    closePlayModal,
    isPlayModalOpen,
    resetGame,
    renameSave,
  } = game as any; // (keeps this compiling even if your hook returns slightly different names)

  return (
    <div className="app-shell">
      {/* Top bar */}
      <div className="topbar">
        <SaveBar
          saveName={state?.saveName}
          lastSavedAt={state?.lastSavedAt}
          onRename={renameSave}
        />

        <div className="topbar-actions">
          <button
            className="btn btn-secondary"
            onClick={() => window.open("viewer", "_blank", "noopener,noreferrer")}
          >
            Open Viewer Screen
          </button>

          <UploadSongClipsButton />

        </div>
      </div>

      <div className="layout">
        {/* Left / Main */}
        <div className="main-card">
          <div className="main-top">
            <div className="ball-wrap">
              <NumberBall value={state?.currentNumber ?? null} />
            </div>

            <div className="controls">
              <div className="label">Current number</div>
              <div className="current-number">{state?.currentNumber ?? "—"}</div>

              <div className="btn-row">
                <button className="btn btn-primary" onClick={callNextNumber}>
                  Call Next Number
                </button>

                <button className="btn btn-secondary" onClick={openPlayModal}>
                  Play Song Popup
                </button>
              </div>

              <button className="btn btn-secondary" onClick={resetGame}>
                Reset game
              </button>
            </div>
          </div>

          {/* Big logo area (your boombox bingo logo image) */}
          <div className="brand-area">
            <img
              src={`${import.meta.env.BASE_URL}branding/game-logo.png`}
              alt="Boombox Bingo"
              className="game-logo"
              draggable={false}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="side">
          <HistoryPanel calledNumbers={state?.calledNumbers ?? []} />

          <div className="panel">
            <div className="panel-title">Instructions</div>
            <ul className="panel-list">
              <li>Upload clips named 1.mp3 to 90.mp3</li>
              <li>Click Call Next Number</li>
              <li>Click Play Song</li>
              <li>Use Viewer Screen for TV display</li>
            </ul>
          </div>

          <div className="panel">
            <div className="panel-title">Viewer Preview</div>

            <div className="viewer-pip">
              <iframe
                title="Viewer Preview"
                src="viewer"
                className="viewer-iframe"
              />
            </div>

            {/* small GTM logo directly under PIP */}
            <div className="gtm-wrap">
              <img
                src={`${import.meta.env.BASE_URL}branding/gtm-logo.png`}
                alt="GTM Game Dev"
                className="gtm-logo"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      <PlaySongModal
        isOpen={isPlayModalOpen}
        onClose={closePlayModal}
        currentNumber={state?.currentNumber ?? null}
      />
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
