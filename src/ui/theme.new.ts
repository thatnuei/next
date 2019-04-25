import { rgb, shade } from "polished"

const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
const river = rgb(52, 152, 219)
const emerald = rgb(46, 204, 113)
const tomato = rgb(231, 76, 60)
const carrot = rgb(230, 126, 34)

const themeColor = midnight
const primaryColor = shade(0.15, river)
const textColor = clouds

export const baseTheme = {
  colors: {
    theme: themeColor,
    primary: primaryColor,
    text: textColor,
  },
}

export type AppTheme = typeof baseTheme
export type AppThemeColor = keyof AppTheme["colors"]
