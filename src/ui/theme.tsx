import { rgb, shade } from "polished"
import React, { useContext } from "react"
import { StyledThemeProvider, ThemeContext } from "./styled"

const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
const river = rgb(52, 152, 219)
const emerald = rgb(46, 204, 113)

// might need these later, for warnings and danger
// const tomato = rgb(231, 76, 60)
// const carrot = rgb(230, 126, 34)

const themeColor = midnight
const textColor = clouds

export const baseTheme = {
  colors: {
    theme0: themeColor,
    theme1: shade(0.3, themeColor),
    theme2: shade(0.5, themeColor),
    theme3: shade(0.8, themeColor),
    primary: river,
    text: textColor,
    success: emerald,
  },
}

export const spacing = {
  none: "0",
  hair: "1px",
  thin: "2px",
  xxsmall: "3px",
  xsmall: "6px",
  small: "12px",
  medium: "24px",
  large: "32px",
}

export const shadows = {
  normal: "0px 4px 8px rgba(0, 0, 0, 0.3)",
}

export type AppTheme = typeof baseTheme
export type AppThemeColor = keyof AppTheme["colors"]

export function ThemeProvider(props: {
  theme: AppTheme
  children: React.ReactNode
}) {
  return (
    <StyledThemeProvider theme={props.theme}>
      <>{props.children}</>
    </StyledThemeProvider>
  )
}

export const useTheme = () => useContext(ThemeContext)
