export type SaveData = {
  version: 1;
  saveName: string;           // displayed name (defaults to "order")
  calledNumbers: number[];    // in order called
  remainingNumbers: number[]; // numbers not yet called
  currentNumber: number | null;
  updatedAtISO: string;
};
