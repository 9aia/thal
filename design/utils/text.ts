export function ellipsis(text: string, maxLength: number = 30) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength - 3) + "...";
  }
  return text;
}
