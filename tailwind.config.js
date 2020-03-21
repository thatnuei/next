// @ts-check
const { rgb, shade } = require("polished")

const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
const emerald = rgb(46, 204, 113)
const tomato = rgb(231, 76, 60)

module.exports = {
  theme: {
    fontFamily: {
      body: `Roboto, sans-serif`,
      header: `'Roboto Condensed', sans-serif`,
    },
    colors: {
      "background-0": midnight,
      "background-1": shade(0.3, midnight),
      "background-2": shade(0.5, midnight),
      "text": clouds,
    },
    boxShadow: {
      normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
      inner: "0px 1px 4px rgba(0, 0, 0, 0.2) inset",
    },
    spacing: {
      "px": "1px",
      "px2": "2px",
      "0": "0",
      "1": "4px",
      "2": "8px",
      "3": "12px",
      "4": "16px",
      "5": "24px",
      "6": "32px",
      "8": "40px",
      "10": "48px",
      "12": "56px",
      "16": "64px",
      "20": "80px",
      "24": "96px",
      "32": "128px",
      "40": "160px",
      "48": "192px",
      "56": "224px",
      "64": "256px",
    },
  },
  variants: {},
  plugins: [],
}
