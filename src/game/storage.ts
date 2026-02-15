import type { SaveData } from "./types";

const KEY = "bingo_host_save_v1";

export function loadSave(): SaveData | null {
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

export function writeSave(save: SaveData) {
  localStorage.setItem(KEY, JSON.stringify(save));
}

export function clearSave() {
  localStorage.removeItem(KEY);
}
