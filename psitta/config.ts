export const DEFAULT_CONFIG = {
  content: ['./app/**/*.vue', './app/composables/*.ts', './app/constants/*.ts'],
  messageRegex: [
    /\bt\s*\(\s*(["'`])(.*?)\1\s*[,)]/g, // t() function calls
    /<[^>]*T\s[^>]*text\s*=\s*(["'`])([^"'`]*)\1[^>]*>/g, // T component with text prop
  ],
  // messageRegex: /(?<=[a-zA-Z0-9])t\(['"]([^'"]+)['"]\)/g,
  messagePerChunk: 10,
  localesFolder: './app/locales',
}

export const CONFIG = DEFAULT_CONFIG
