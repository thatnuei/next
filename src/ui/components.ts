import {
  activePress,
  bgMidnight,
  bgSemiBlack,
  block,
  cursorPointer,
  flex,
  focus,
  h,
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

export const solidButton = css(
  px(4),
  py(2),
  bgSemiBlack(25),
  transition("background-color, transform"),
  hover(bgSemiBlack(50)),
  activePress,
)

export const fadedButton = css(
  opacity(50),
  transition("opacity, transform"),
  hover(opacity(100)),
  activePress,
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
  hover(opacity(100)),
)

// content-size the FocusOn div, which can't be styled directly
export const focusOnFillFix = css({
  "> div": [w("full"), h("full"), flex("column")],
})
