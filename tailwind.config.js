// @ts-check
const { rgb, rgba } = require("polished")

// https://flatuicolors.com/palette/defo
const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
const emerald = rgb(46, 204, 113)
const tomato = rgb(231, 76, 60)
const sunflower = rgb(241, 196, 15)
const carrot = rgb(230, 126, 34)
const river = rgb(52, 152, 219)

// TODO: customize responsive queries and give them better names: small, medium, large

module.exports = {
  theme: {
    fontFamily: {
      body: `Roboto, sans-serif`,
      header: `'Roboto Condensed', sans-serif`,
    },
    fontWeight: {
      "weight-light": "300",
      "weight-normal": "400",
      "weight-bold": "500",
    },
    colors: {
      "background-0": `var(--color-background-0)`,
      "background-1": `var(--color-background-1)`,
      "background-2": `var(--color-background-2)`,
      "text": `var(--color-text)`,

      "white": clouds,
      "black": midnight,
      "black-faded": rgba(0, 0, 0, 0.5),

      "red": tomato,
      "red-faded": rgba(tomato, 0.25),
      "green": emerald,
      "green-faded": rgba(emerald, 0.25),
      "blue": river,
      "blue-faded": rgba(river, 0.25),
      "yellow": sunflower,
      "yellow-faded": rgba(sunflower, 0.25),
      "orange": carrot,
      "orange-faded": rgba(carrot, 0.25),
    },
    boxShadow: {
      normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
      inner: "0px 1px 4px rgba(0, 0, 0, 0.2) inset",
    },
    spacing: {
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
      "px": "1px",
      "px2": "2px",
      "gap": "4px", // represents the separating gap between sections of some layouts
    },
  },
  variants: {},
  plugins: [],
}
