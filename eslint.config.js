import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  { ignores: ['dist', 'public'] },
  {
    files: ['scripts/**', 'src/asistente/herramientas/**'],
    languageOptions: { globals: globals.node },
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Sin este plugin, ESLint no ve el uso de componentes en JSX: se ignoran las mayúsculas.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // REGLAS.md, reglas 4 y 6.
      'no-console': 'warn',
      'no-alert': 'error',
    },
  },
]
