import { rgb, shade } from "polished"
import { Theme } from "theme-ui"

// http://flatuicolors.com/
const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
export const emerald = rgb(46, 204, 113)
export const tomato = rgb(231, 76, 60)

export const theme: Theme = {
  colors: {
    background: midnight,
    background0: midnight,
    background1: shade(0.3, midnight),
    background2: shade(0.5, midnight),
    text: clouds,
    muted: shade(0.5, midnight),
  },
}

// type ColorPalette = Record<0 | 1 | 2, string>

// export type AppTheme = {
//   colors: {
//     background: ColorPalette
//     text: string
//   }
//   shadow: {
//     normal: string
//     inner: string
//   }
// }

// export type BackgroundColorKey = keyof AppTheme["colors"]["background"]

// export const midnightTheme: AppTheme = {
//   colors: {
//     background: [midnight, shade(0.3, midnight), shade(0.5, midnight)],
//     text: clouds,
//   },
//   shadow: {
//     normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
//     inner: "0px 1px 4px rgba(0, 0, 0, 0.2) inset",
//   },
// }

// export const lightTheme: AppTheme = {
//   ...midnightTheme,
//   colors: {
//     ...midnightTheme.colors,
//     background: [clouds, shade(0.1, clouds), shade(0.3, clouds)],
//     text: shade(0.1, midnight),
//   },
//   shadow: {
//     ...midnightTheme.shadow,
//     normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
//   },
// }

// export { ThemeProvider, useTheme }

// declare module "@emotion/react" {
//   export interface Theme extends AppTheme {}
// }
