// @ts-check

import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  // Bỏ qua các file và thư mục không cần thiết
  {
    ignores: [
      'node_modules/',
      'build/',
      'dist/',
      '.react-router',
      'app/components/ui',
      '*.config.js',
      '*.config.ts',
      'components.json',
    ],
  },

  // Cấu hình chung cho toàn bộ dự án
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: 'detect', // Tự động phát hiện phiên bản React
      },
    },
  },

  // Các quy tắc mặc định của ESLint
  pluginJs.configs.recommended,

  // Cấu hình cho TypeScript
  ...tseslint.configs.recommended,

  // Tùy chỉnh hoặc tắt các quy tắc TypeScript cụ thể
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Cấu hình cho React (thay thế cho pluginReact.configs.recommended)
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules, // Tắt quy tắc yêu cầu import React
      'react/prop-types': 'off', // Tắt prop-types vì đã dùng TypeScript
    },
  },

  // Cấu hình cho React Hooks (Rất quan trọng!)
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'warn', // cái này có thể bật lại cho an toàn
    },
  },
]
