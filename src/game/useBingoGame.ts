import { useEffect, useMemo, useState } from "react";
import type { SaveData } from "./types";
import { loadSave, writeSave, clearSave } from "./storage";
import { makeRange1to90, pickRandomIndex } from "./rng";

function nowISO() {
  return new Date().toISOString();
}

function makeFreshSave(saveName: string): SaveData {
  return {
    version: 1,
    saveName,
    calledNumbers: [],
    remainingNumbers: makeRange1to90(),
    currentNumber: null,
    updatedAtISO: nowISO()
  };
}

export function useBingoGame() {
  const [save, setSave] = useState<SaveData>(() => loadSave() ?? makeFreshSave("order"));
  const [modalOpen, setModalOpen] = useState(false);

  // Always save on any change
  useEffect(() => {
    writeSave({ ...save, updatedAtISO: nowISO() });
  }, [save]);

  const calledSet = useMemo(() => new Set(save.calledNumbers), [save.calledNumbers]);
  const isFinished = save.remainingNumbers.length === 0;

  function callNextNumber() {
    if (isFinished) return;

    const idx = pickRandomIndex(save.remainingNumbers.length);
    const n = save.remainingNumbers[idx];

    const nextRemaining = save.remainingNumbers.slice();
    nextRemaining.splice(idx, 1);

    setSave((prev) => ({
      ...prev,
      currentNumber: n,
      calledNumbers: [...prev.calledNumbers, n],
      remainingNumbers: nextRemaining
    }));

    setModalOpen(true);
  }

  function resetGame() {
    // Wipe saved game, then restart fresh but keep the saveName
    clearSave();
    setSave(makeFreshSave(save.saveName));
    setModalOpen(false);
  }

  function setSaveName(name: string) {
    const clean = name.trim() || "order";
    setSave((prev) => ({ ...prev, saveName: clean }));
  }

  return {
    save,
    calledSet,
    modalOpen,
    setModalOpen,
    isFinished,
    callNextNumber,
    resetGame,
    setSaveName
  };
}
