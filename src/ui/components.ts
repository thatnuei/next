import {
  bgMidnight,
  bgSemiBlack,
  block,
  cursorPointer,
  focus,
  hover,
  opacity,
  outlineNone,
  px,
  py,
  shadow,
  transition,
  underline,
  w,
} from "./helpers.new"
import { css } from "./styled"

export const raisedPanel = css(bgMidnight(700), shadow)

export const buttonSolid = css(
  px(4),
  py(2),
  bgSemiBlack(25),
  transition("background-color"),
  hover(bgSemiBlack(50)),
)

export const input = css(
  px(4),
  py(2),
  bgSemiBlack(25),
  transition("background-color"),
  block,
  w("full"),
  hover(bgSemiBlack(50)),
  focus(bgSemiBlack(50), outlineNone),
)

export const anchor = css(
  cursorPointer,
  opacity(75),
  transition("opacity"),
  underline,
)
