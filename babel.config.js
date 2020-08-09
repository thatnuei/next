module.exports = {
  presets: [
    ["@babel/preset-env", { modules: false }],
    "@babel/preset-react",
    "@babel/preset-typescript",
    ["@emotion/babel-preset-css-prop", { autoLabel: "never" }], // autoLabel breaks css prop overrides
  ],
  plugins: ["@babel/plugin-proposal-class-properties", "babel-plugin-macros"],
}
