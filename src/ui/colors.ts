import { shade } from "polished"

// http://flatuicolors.com/
export const clouds = "rgb(236, 240, 241)"
export const cloudsDark = "rgb(189, 195, 199)"

const flist = "hsl(210, 60%, 20%)"

export const themeColor = flist
export const themeBackgroundColor = shade(0.5, themeColor)
export const textColor = clouds

export const semiBlack = (alpha = 0.5) => `rgba(0, 0, 0, ${alpha})`
