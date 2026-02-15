export function makeRange1to90(): number[] {
  const arr: number[] = [];
  for (let i = 1; i <= 90; i++) arr.push(i);
  return arr;
}

export function pickRandomIndex(maxExclusive: number): number {
  // cryptographically stronger than Math.random if available
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.getRandomValues) {
    const buf = new Uint32Array(1);
    cryptoObj.getRandomValues(buf);
    return buf[0] % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}
