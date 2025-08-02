import js from '@eslint/js'
import tsLint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist', 'node_modules', 'coverage', '*.config.js']
  },
  js.configs.recommended,
  ...tsLint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2023,
        process: 'readonly'
      },
      parser: tsLint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // React 19 - Plus de forwardRef
      'react/no-deprecated': 'error',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Console - Adaptatif selon NODE_ENV
      'no-console': process.env.NODE_ENV === 'production'
        ? ['error', { allow: ['warn', 'error'] }]
        : ['warn', { allow: ['log', 'warn', 'error', 'info', 'debug'] }],

      // Règles générales
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn'
    }
  }
]
