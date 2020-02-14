import {
  focus,
  fontLightCondensed,
  fontSize,
  hover,
  outlineNone,
  px,
  py,
  themeBgColor,
  transition,
} from "./style"
import { AppTheme } from "./theme"

const baseControlStyle = (theme: AppTheme) => [
  py(2),
  px(3),
  themeBgColor(1)(theme),
  hover(themeBgColor(2)(theme)),
  focus(themeBgColor(2)(theme), outlineNone),
  transition("background-color"),
]

export const solidButton = (theme: AppTheme) => [...baseControlStyle(theme)]

export const input = (theme: AppTheme) => [...baseControlStyle(theme)]

export const headerText = [fontSize("xlarge"), fontLightCondensed]
