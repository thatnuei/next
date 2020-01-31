import { Interpolation } from "@emotion/core"
import { css } from "./styled"

type SizeUnit =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24
  | 32
  | 40
  | 48
  | 56
  | 64
  | string

type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse"

type FlexAlign = "flex-start" | "flex-end" | "center" | "stretch"

export const space = (unit: SizeUnit) =>
  typeof unit === "number" ? `${unit / 4}rem` : unit === "full" ? "100%" : unit

// layout
export const m = (unit: SizeUnit) => css({ margin: space(unit) })
export const mb = (unit: SizeUnit) => css({ marginBottom: space(unit) })
export const mt = (unit: SizeUnit) => css({ marginTop: space(unit) })
export const ml = (unit: SizeUnit) => css({ marginLeft: space(unit) })
export const mr = (unit: SizeUnit) => css({ marginRight: space(unit) })
export const mx = (unit: SizeUnit) => css(ml(unit), mr(unit))
export const my = (unit: SizeUnit) => css(mt(unit), mb(unit))

export const p = (unit: SizeUnit) => css({ padding: space(unit) })
export const pb = (unit: SizeUnit) => css({ paddingBottom: space(unit) })
export const pt = (unit: SizeUnit) => css({ paddingTop: space(unit) })
export const pl = (unit: SizeUnit) => css({ paddingLeft: space(unit) })
export const pr = (unit: SizeUnit) => css({ paddingRight: space(unit) })
export const px = (unit: SizeUnit) => css(pl(unit), pr(unit))
export const py = (unit: SizeUnit) => css(pt(unit), pb(unit))

export const w = (unit: SizeUnit) => css({ width: space(unit) })
export const h = (unit: SizeUnit) => css({ height: space(unit) })
export const wh = (unit: SizeUnit) => [w(unit), h(unit)]

export const block = css({ display: "block" })
export const inlineBlock = css({ display: "inline-block" })
export const inline = css({ display: "inline" })
export const displayNone = css({ display: "none" })

export const absolute = css({ position: "absolute" })
export const fixed = css({ position: "fixed" })
export const relative = css({ position: "relative" })
export const left = (unit: SizeUnit) => css({ left: space(unit) })
export const right = (unit: SizeUnit) => css({ right: space(unit) })
export const top = (unit: SizeUnit) => css({ top: space(unit) })
export const bottom = (unit: SizeUnit) => css({ bottom: space(unit) })

export const flex = (flexDirection: FlexDirection = "row") =>
  css({ display: "flex", flexDirection })

export const flex1 = css({ flex: 1 })

export const alignItems = (alignment: FlexAlign) =>
  css({ alignItems: alignment })

export const alignSelf = (alignment: FlexAlign) => css({ alignSelf: alignment })

export const justifyContent = (
  alignment:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around",
) => css({ justifyContent: alignment })

const sizes = {
  xs: "20rem",
  sm: "24rem",
  md: "28rem",
  lg: "32rem",
  xl: "36rem",
  xl2: "42rem",
  xl3: "48rem",
  xl4: "56rem",
  xl5: "64rem",
  xl6: "72rem",
  full: "100%",
}

export const minW = (key: keyof typeof sizes) => css({ minWidth: sizes[key] })
export const minH = (key: keyof typeof sizes) => css({ minWidth: sizes[key] })

export const maxW = (key: keyof typeof sizes) => css({ maxWidth: sizes[key] })
export const maxH = (key: keyof typeof sizes) => css({ maxWidth: sizes[key] })

export const absoluteCover = css({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
})

// typeography
export const fontNormal = css({ fontFamily: "Roboto, sans-serif" })
export const fontCondensed = css({
  fontFamily: '"Roboto Condensed", sans-serif',
})

export const weightNormal = css({ fontWeight: 400 })
export const weightLight = css({ fontWeight: 300 })
export const weightBold = css({ fontWeight: 500 })

export const underline = css({ textDecoration: "underline" })
export const lineThrough = css({ textDecoration: "line-through" })

const textSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  xl2: "1.5rem",
  xl3: "1.875rem",
  xl4: "2.25rem",
  xl5: "3rem",
}

export const textSize = (key: keyof typeof textSizes) =>
  css({ fontSize: textSizes[key] })

export const textCenter = css({ textAlign: "center" })
export const textLeft = css({ textAlign: "left" })
export const textRight = css({ textAlign: "right" })

// colors
const colors = {
  midnight: {
    100: "hsl(212, 42%, 85%)",
    200: "hsl(211, 42%, 75%)",
    300: "hsl(212, 43%, 65%)",
    400: "hsl(211, 42%, 55%)",
    500: "hsl(211, 42%, 45%)",
    600: "hsl(211, 43%, 35%)",
    700: "hsl(211, 42%, 25%)",
    800: "hsl(210, 42%, 18%)",
    900: "hsl(207, 44%, 13%)",
  },
  // not sure if we need more? lol
}

export const bgMidnight = (key: keyof typeof colors.midnight) =>
  css({ backgroundColor: colors.midnight[key] })

export const textMidnight = (key: keyof typeof colors.midnight) =>
  css({ color: colors.midnight[key] })

export const bgWhite = () => css({ backgroundColor: "rgba(236, 240, 241,1.0)" })

export const textWhite = () => css({ color: "rgba(236, 240, 241,1.0)" })

export const bgSemiBlack = (opacity: 25 | 50 | 75) =>
  css({ backgroundColor: `rgba(0, 0, 0, 0.${opacity})` })

// states
export const hover = (...styles: Interpolation[]) =>
  css({ ":hover": css(...styles) as any })

export const focus = (...styles: Interpolation[]) =>
  css({ ":focus": css(...styles) as any })

export const active = (...styles: Interpolation[]) =>
  css({ ":active": css(...styles) as any })

// effects
export const opacity = (amount: 0 | 25 | 50 | 75 | 100) =>
  css({ opacity: `${amount}%` })

export const visible = css({ visibility: "visible" })
export const hidden = css({ visibility: "hidden" })

export const shadow = css({
  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
})

export const shadowInner = css({
  boxShadow: "inset 0 0 4px 0 rgba(0, 0, 0, 0.2)",
})

export const transition = (...properties: string[]) =>
  css({
    transition: "0.2s",
    transitionProperty:
      properties.length > 0 ? properties.join(", ") : undefined,
  })

export const scaleDown = css({ transform: "scale(0.95)" })

export const translateDown = css({ transform: `translateY(${space(5)})` })

export const activePress = active({
  transform: `translateY(2px)`,
  transition: "none",
})

// interaction
export const cursorPointer = css({ cursor: "pointer" })

export const outlineNone = css({ outline: 0 })

// responsiveness
export const media = {
  sm: (...styles: Interpolation[]) =>
    css({ "@media (min-width: 640px)": css(...styles) }),
  md: (...styles: Interpolation[]) =>
    css({ "@media (min-width: 768px)": css(...styles) }),
  lg: (...styles: Interpolation[]) =>
    css({ "@media (min-width: 1024px)": css(...styles) }),
  xl: (...styles: Interpolation[]) =>
    css({ "@media (min-width: 1200px)": css(...styles) }),
}
