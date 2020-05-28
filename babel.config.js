module.exports = {
  presets: [
    "@babel/env",
    "@babel/react",
    "@babel/typescript",
    "@emotion/css-prop",
  ],
  plugins: [
    ["@babel/proposal-decorators", { legacy: true }],
    ["@babel/proposal-class-properties", { loose: true }],
    "macros",
  ],
}
