module.exports = {
  extends: "@snowpack/app-scripts-react/babel.config.json",
  presets: [
    ["@emotion/babel-preset-css-prop", { autoLabel: "never" }], // autoLabel breaks css prop overrides
  ],
  plugins: ["babel-plugin-lodash", "babel-plugin-macros"],
}
