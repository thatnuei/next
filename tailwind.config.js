// @ts-check
const { rgb, shade } = require("polished")

const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
const emerald = rgb(46, 204, 113)
const tomato = rgb(231, 76, 60)

module.exports = {
  theme: {
    colors: {
      background0: midnight,
      background1: shade(0.3, midnight),
      background2: shade(0.5, midnight),
      text: clouds,
    },
    boxShadow: {
      normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
      inner: "0px 1px 4px rgba(0, 0, 0, 0.2) inset",
    },
  },
  variants: {},
  plugins: [],
}
