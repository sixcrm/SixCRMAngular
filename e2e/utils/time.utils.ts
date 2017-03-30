export function createTimestampSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
