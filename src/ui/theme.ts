import { ThemeProvider, useTheme } from "@emotion/react"
import { rgb, shade } from "polished"

type ColorPalette = Record<0 | 1 | 2 | 3, string>

export type AppTheme = {
  colors: {
    background: ColorPalette
    text: string
  }
  shadow: {
    normal: string
  }
}

export type BackgroundColorKey = keyof AppTheme["colors"]["background"]

// http://flatuicolors.com/
const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)

export const midnightTheme: AppTheme = {
  colors: {
    background: [
      midnight,
      shade(0.2, midnight),
      shade(0.35, midnight),
      shade(0.5, midnight),
    ],
    text: clouds,
  },
  shadow: {
    normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
  },
}

export const lightTheme: AppTheme = {
  ...midnightTheme,
  colors: {
    ...midnightTheme.colors,
    background: [
      clouds,
      shade(0.15, clouds),
      shade(0.25, clouds),
      shade(0.3, clouds),
    ],
    text: shade(0.1, midnight),
  },
  shadow: {
    ...midnightTheme.shadow,
    normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
  },
}

export { ThemeProvider, useTheme }

declare module "@emotion/react" {
  export interface Theme extends AppTheme {}
}
