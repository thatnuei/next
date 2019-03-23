import { rgb, shade } from "polished"

// http://flatuicolors.com/
const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
const river = rgb(52, 152, 219)
const emerald = rgb(46, 204, 113)
const tomato = rgb(231, 76, 60)
const carrot = rgb(230, 126, 34)

export const themeColor = midnight
export const themeBackgroundColor = shade(0.5, themeColor)
export const textColor = clouds

export const primaryColor = shade(0.1, river)
export const successColor = emerald
export const warningColor = carrot
export const dangerColor = tomato

export const semiBlack = (alpha = 0.5) => `rgba(0, 0, 0, ${alpha})`
