export const DEFAULT_CONFIG = {
  content: ['./app/**/*.vue', './app/composables/*.ts', './app/constants/*.ts', './app/middleware/*.ts'],
  messageRegex: [
    /\bt\s*\(\s*(["'`])(.*?)\1\s*[,)]/g, // t() function calls
    /<[^>]*T\s[^>]*text\s*=\s*(["'`])((?:(?!\1)[^\\]|\\.)*)\1[^>]*>/g, // T component with text prop
  ],
  messagePerChunk: 50,
  localesFolder: './app/locales',
}

export const CONFIG = DEFAULT_CONFIG
