import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.config({
    extends: ["next/core-web-vitals", "eslint:recommended"], // Ensure compatibility with Next.js
    rules: {
      "no-console": "warn", // Example rule: Warns on console logs
    },
    settings: {
      react: {
        version: "detect", // Automatically detects React version
      },
    },
  }),
];
