module.exports = {
  presets: ["@babel/env", "@babel/typescript", "@babel/react"],
  plugins: [
    ["@babel/proposal-decorators", { legacy: true }],
    ["@babel/proposal-class-properties", { loose: true }],
    "@babel/transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    "babel-plugin-styled-components",
  ],
}
