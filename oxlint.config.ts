import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "react-perf", "eslint", "import", "react", "unicorn", "jsx-a11y"],
  jsPlugins: ["eslint-plugin-unused-imports"],
  rules: {
    "unused-imports/no-unused-imports": "error",
    "perfectionist/sort-imports": "error",
  },
  settings: {},
  env: {
    builtin: true,
  },
  ignorePatterns: [".expo", "android/", "ios/", "metro.config.js"],
});
