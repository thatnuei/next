module.exports = {
  presets: ["@babel/env", "@babel/react", "@babel/typescript"],
  plugins: [
    ["@babel/proposal-decorators", { legacy: true }],
    ["@babel/proposal-class-properties", { loose: true }],
    "@babel/transform-runtime",
    "react-refresh/babel",
    "styled-components",
    "lodash",
  ],
}
