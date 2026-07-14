export function nextRandom(seed: number): { value: number; nextSeed: number } {
  const nextSeed = (1664525 * seed + 1013904223) % 2 ** 32;
  return { value: nextSeed / 2 ** 32, nextSeed };
}
