import typescriptEslint from '@typescript-eslint/eslint-plugin';
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import next from '@next/eslint-plugin-next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default  [
  {
    ignores: ['**/node_modules/*',
      '.next/*',
      'dist/*',
      'public/*']
  },
  {
    plugins: {
      '@next/next': next,
      '@typescript-eslint': typescriptEslint

    },
    rules: {
      '@next/next/no-html-link-for-pages': 'error',
      '@typescript-eslint/no-unused-vars': 'warn', // Change from error to warn if needed
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
]

;
