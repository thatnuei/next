module.exports = {
  presets: [
    ["@babel/env", { bugfixes: true, targets: { esmodules: true } }],
    "@babel/react",
    "@babel/typescript",
    ["@emotion/css-prop", { autoLabel: "never" }],
  ],
  plugins: [
    ["@babel/proposal-decorators", { legacy: true }],
    ["@babel/proposal-class-properties", { loose: true }],
    "macros",
  ],
}
