import { rgb, rgba, shade } from "polished"
import * as styledComponents from "styled-components"

const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
const river = rgb(52, 152, 219)
const emerald = rgb(46, 204, 113)
const tomato = rgb(231, 76, 60)
const carrot = rgb(230, 126, 34)

const themeColor = midnight
const primaryColor = river
const textColor = clouds

export type AppTheme = typeof darkTheme

export enum ThemeColor {
  bg = "bg",
  bgDark = "bgDark",
  bgDivision = "bgDivision",
  bgShaded = "bgShaded",
  text = "text",
  primary = "primary",
}

const generateHeadingLevels = (sizes: string[]) => {
  const result: Record<number, object> = {}
  for (const [index, size] of sizes.entries()) {
    result[index + 1] = { medium: { size, height: size } }
  }
  return result
}

export const darkTheme = {
  global: {
    font: {
      family: "Roboto, sans-serif",
      size: "15px",
    },
    colors: {
      [ThemeColor.bg]: themeColor,
      [ThemeColor.bgDark]: shade(0.35, themeColor),
      [ThemeColor.bgDivision]: shade(0.7, themeColor),
      [ThemeColor.bgShaded]: rgba("black", 0.25),
      [ThemeColor.text]: textColor,
      [ThemeColor.primary]: primaryColor,
      brand: primaryColor,
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
    breakpoints: {
      // disables default responsive sizing
      small: { value: 0 },
    },
    elevation: {
      light: {
        none: "none",
        xsmall: "0px 1px 2px rgba(0, 0, 0, 0.5)",
        small: "0px 2px 4px rgba(0, 0, 0, 0.5)",
        medium: "0px 4px 8px rgba(0, 0, 0, 0.5)",
        large: "0px 8px 16px rgba(0, 0, 0, 0.5)",
        xlarge: "0px 12px 24px rgba(0, 0, 0, 0.5)",
      },
    },
    focus: {
      border: {
        color: primaryColor,
      },
    },
  },
  heading: {
    font: { family: "Roboto Condensed" },
    weight: 300,
    height: "auto",
    level: generateHeadingLevels(["30px", "24px", "20px"]),
  },
  layer: {
    background: "none",
  },
  text: {
    small: {
      size: "12px",
      height: "16px",
    },
    medium: {
      size: "15px",
      height: "18px",
      maxWidth: "432px",
    },
    large: {
      size: "20px",
      height: "28px",
      maxWidth: "528px",
    },
  },
  button: {
    color: {
      dark: textColor,
      light: themeColor,
    },
    border: {
      radius: "4px",
    },
    primary: {},
  },
  textInput: {
    extend: {
      fontWeight: 400,
      background: rgba("black", 0.5),
      border: "none",
      borderRadius: 0,
    },
  },
}

export const {
  default: styled,
  css,
  keyframes,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<AppTheme>
