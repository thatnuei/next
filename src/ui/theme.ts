import { ThemeProvider, useTheme } from "@emotion/react"
import { darken, rgb, shade } from "polished"

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

export const darkTheme: AppTheme = {
  colors: {
    background: [
      midnight,
      shade(0.2, midnight),
      shade(0.4, midnight),
      shade(0.6, midnight),
    ],
    text: clouds,
  },
  shadow: {
    normal: "0px 2px 6px rgba(0, 0, 0, 0.25)",
  },
}

export const lightTheme: AppTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: [
      clouds,
      shade(0.1, clouds),
      shade(0.2, clouds),
      shade(0.3, clouds),
    ],
    text: darken(0.2, midnight),
  },
  shadow: {
    ...darkTheme.shadow,
    normal: "0px 2px 6px rgba(0, 0, 0, 0.5)",
  },
}

export { ThemeProvider, useTheme }

declare module "@emotion/react" {
  export interface Theme extends AppTheme {}
}
