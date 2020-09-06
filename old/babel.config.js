module.exports = {
  presets: [
    // autoLabel breaks css prop overrides
    ["@emotion/babel-preset-css-prop", { autoLabel: "never" }],
  ],
  plugins: ["@babel/plugin-proposal-class-properties"],
}
