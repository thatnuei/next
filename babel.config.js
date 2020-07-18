module.exports = {
  presets: [
    ["@babel/env", { modules: false }],
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
