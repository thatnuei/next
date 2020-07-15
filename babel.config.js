module.exports = {
  presets: [
    ["@babel/env", { modules: false }],
    "@babel/react",
    ["@babel/typescript", { allExtensions: true, isTSX: true }],
    ["@emotion/css-prop", { autoLabel: "never" }], // autoLabel breaks css prop overrides
  ],
  plugins: [
    "macros",
    ["@babel/proposal-decorators", { legacy: true }],
    "@babel/proposal-class-properties",
  ],
}
