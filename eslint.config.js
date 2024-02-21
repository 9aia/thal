// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
    'import/order': 'off',
    'ts/ban-ts-comment': 'off',
    'ts/no-namespace': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'ts/consistent-type-definitions': 'off',
    'no-restricted-syntax': [
      'error',
      {
        message:
          'Do not import default from lodash-es. Use a namespace import (* as) instead.',
        selector:
          'ImportDeclaration[source.value="lodash-es"] ImportDefaultSpecifier',
      },
    ],
  },
})
