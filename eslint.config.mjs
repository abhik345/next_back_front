import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = {
  extends: [
    ...compat.extends("next/core-web-vitals"),
    "eslint:recommended", // Add recommended ESLint settings
  ],
  rules: {
    // Custom ESLint rules can be added here
    "no-console": "warn", // Example: warning on console logs in production
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the react version you're using
    },
  },
};

export default eslintConfig;
