module.exports = {
  presets: [
    ["@emotion/css-prop", { autoLabel: "never" }], // autoLabel breaks css prop overrides
  ],
  plugins: ["macros"],
}
