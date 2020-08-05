module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "no-unused-vars": "off",
    "require-await": "error",
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks:
          "useRecoilCallback|useComputedObservable|useMemoizedObservable",
      },
    ],
    "react/no-children-prop": "off",
    "react/prop-types": "off",
    "@typescript-eslint/unbound-method": "off",
    "jsx-a11y/no-onchange": "off",
  },
  ignorePatterns: ["/node_modules/", "/src/node_modules/", "/build/"],
  settings: {
    react: { version: "detect" },
  },
}
