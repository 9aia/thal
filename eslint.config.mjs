// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  await antfu({
    stylistic: {
      indent: 2,
      quotes: 'single',
    },

    typescript: true,
    vue: true,

    jsonc: false,
    yaml: false,

    rules: {
      'no-console': ['off'],
      'ts/no-unused-expressions': ['off'],
      'eslint-comments/no-unlimited-disable': ['off'],
      'eslint-comments/no-unused-disable': 'off',
    },
  }),
  {
    ignores: [
      'server/worker-configuration.d.ts',
    ],
  },
)
