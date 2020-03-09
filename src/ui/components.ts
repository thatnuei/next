import { SxStyleProp } from "theme-ui"
import {
  disabled,
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

const activePress: SxStyleProp = {
  ":active": {
    transform: `translateY(2px)`,
    transition: "none",
  },
}

const fadedWhenDisabled: SxStyleProp = {
  ":disabled": { opacity: 0.5 },
}

const baseControlStyle = (theme: AppTheme) => [
  py(2),
  px(3),
  themeBgColor(1)(theme),
  hover(themeBgColor(2)(theme)),
  transition("background-color"),
  fadedWhenDisabled,
]

export const solidButton = (theme: AppTheme) => [
  baseControlStyle(theme),
  activePress,
  transition("transform"),
]

export const fadedButton = [
  opacity(0.5),
  hover(opacity(1)),
  activePress,
  disabled(opacity(0.3)),
  transition("opacity, transform"),
]

export const input = (theme: AppTheme) => [
  baseControlStyle(theme),
  themeShadowInner,
  w("full"),
  focus(themeBgColor(2)(theme)),
  focus(outlineNone),
]

export const select = (theme: AppTheme) => [
  baseControlStyle(theme),
  w("full"),
  activePress,
  transition("transform, background-color"),
]

export const headerText = [fontSize("xlarge"), fontLightCondensed]
export const headerText2 = [fontSize("large"), fontLightCondensed]

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
