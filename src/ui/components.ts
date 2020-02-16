import {
  flexCenter,
  flexRow,
  focus,
  fontLightCondensed,
  fontSize,
  hover,
  opacity,
  outlineNone,
  px,
  py,
  themeBgColor,
  themeShadow,
  themeShadowInner,
  transition,
  underline,
  w,
} from "./style"
import { AppTheme } from "./theme"

const baseControlStyle = (theme: AppTheme) => [
  py(2),
  px(3),
  themeBgColor(1)(theme),
  hover(themeBgColor(2)(theme)),
  focus(themeBgColor(2)(theme)),
  transition("background-color"),
]

export const solidButton = (theme: AppTheme) => baseControlStyle(theme)

export const input = (theme: AppTheme) => [
  baseControlStyle(theme),
  themeShadowInner,
  w("full"),
  focus(outlineNone),
]

export const select = (theme: AppTheme) => [baseControlStyle(theme), w("full")]

export const headerText = [fontSize("xlarge"), fontLightCondensed]

export const raisedPanel = [themeShadow, themeBgColor(0)]

export const raisedPanelHeader = [
  themeBgColor(1),
  py(2),
  px(4),
  flexRow,
  flexCenter,
]

export const anchor = [
  underline,
  opacity(0.5),
  hover(opacity(1)),
  transition("opacity"),
]