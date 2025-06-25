// Normalize strings to handle escaped characters consistently
export function normalizeString(str: string): string {
  // Handle common escaped characters that might differ between code and locale files
  return str
    .replace(/\\'/g, '\'') // Convert escaped single quotes to regular single quotes
    .replace(/\\"/g, '"') // Convert escaped double quotes to regular double quotes
    .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
    .replace(/\\t/g, '\t') // Convert escaped tabs to actual tabs
    .replace(/\\r/g, '\r') // Convert escaped carriage returns to actual carriage returns
}
