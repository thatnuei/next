import { rgb, rgba, shade } from "polished"
import * as styledComponents from "styled-components"

const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
const river = rgb(52, 152, 219)
const emerald = rgb(46, 204, 113)
const tomato = rgb(231, 76, 60)
const carrot = rgb(230, 126, 34)

export type AppTheme = typeof darkTheme

export enum ThemeColor {
  bg = "bg",
  bgDark = "bgDark",
  bgShaded = "bgShaded",
  text = "text",
}

export const darkTheme = {
  global: {
    font: {
      family: "Roboto, sans-serif",
      size: "15px",
    },
    colors: {
      [ThemeColor.bg]: midnight,
      [ThemeColor.bgDark]: shade(0.5, midnight),
      [ThemeColor.bgShaded]: rgba("black", 0.3),
      [ThemeColor.text]: clouds,
    },
    size: {
      xxsmall: "50px",
      xsmall: "100px",
      small: "200px",
      medium: "400px",
      large: "800px",
      xlarge: "1200px",
      xxlarge: "1600px",
      full: "100%",
    },
  },
  heading: {
    font: { family: "Roboto Condensed" },
    weight: 300,
  },
}

export const {
  default: styled,
  css,
  keyframes,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<AppTheme>
