import { rgb, shade } from "polished"
import React from "react"
import * as themeui from "theme-ui"

// http://flatuicolors.com/
const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
export const emerald = rgb(46, 204, 113)
export const tomato = rgb(231, 76, 60)

export type AppTheme = {
  colors: {
    background0: string
    background1: string
    background2: string
    text: string
  }
  fonts: {
    body: string
    heading: string
  }
  shadow: {
    normal: string
    inner: string
  }
}

export const midnightTheme: AppTheme = {
  colors: {
    background0: midnight,
    background1: shade(0.3, midnight),
    background2: shade(0.5, midnight),
    text: clouds,
  },
  fonts: {
    body: "Roboto, sans-serif",
    heading: '"Roboto Condensed", sans-serif',
  },
  shadow: {
    normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
    inner: "0px 1px 4px rgba(0, 0, 0, 0.2) inset",
  },
}

export const lightTheme: AppTheme = {
  ...midnightTheme,
  colors: {
    ...midnightTheme.colors,
    background0: clouds,
    background1: shade(0.1, clouds),
    background2: shade(0.3, clouds),
    text: shade(0.1, midnight),
  },
  shadow: {
    ...midnightTheme.shadow,
    normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
  },
}

export function ThemeProvider(props: {
  theme: AppTheme
  children?: React.ReactNode
}) {
  return React.createElement(themeui.ThemeProvider, props)
}
