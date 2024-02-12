export const now = () => {
  return new Date(new Date().toISOString());
}

export const fromSToMillis = (seconds: number) => {
  return seconds * 1000;
}

export const fromMillisToS = (millis: number) => {
  return Math.floor(millis / 1000);
}
