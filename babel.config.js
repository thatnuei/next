module.exports = {
  presets: [
    ["@babel/env", { modules: false }],
    "@babel/react",
    "@babel/typescript",
    ["@emotion/css-prop", { autoLabel: "never" }], // autoLabel breaks css prop overrides
  ],
  plugins: ["@babel/proposal-class-properties", "lodash", "macros"],
}
