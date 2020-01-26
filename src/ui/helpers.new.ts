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

export const space = (unit: SizeUnit) =>
  typeof unit === "number" ? `${unit / 4}rem` : unit === "full" ? "100%" : unit

// layout
export const m = (unit: SizeUnit) => css({ margin: space(unit) })
export const mb = (unit: SizeUnit) => css({ marginBottom: space(unit) })
export const mt = (unit: SizeUnit) => css({ marginTop: space(unit) })
export const ml = (unit: SizeUnit) => css({ marginLeft: space(unit) })
export const mr = (unit: SizeUnit) => css({ marginRight: space(unit) })
export const mx = (unit: SizeUnit) => css({}, ml(unit), mr(unit))
export const my = (unit: SizeUnit) => css({}, mt(unit), mb(unit))

export const p = (unit: SizeUnit) => css({ padding: space(unit) })
export const pb = (unit: SizeUnit) => css({ paddingBottom: space(unit) })
export const pt = (unit: SizeUnit) => css({ paddingTop: space(unit) })
export const pl = (unit: SizeUnit) => css({ paddingLeft: space(unit) })
export const pr = (unit: SizeUnit) => css({ paddingRight: space(unit) })
export const px = (unit: SizeUnit) => css({}, pl(unit), pr(unit))
export const py = (unit: SizeUnit) => css({}, pt(unit), pb(unit))

export const w = (unit: SizeUnit) => css({ width: space(unit) })
export const h = (unit: SizeUnit) => css({ height: space(unit) })

export const block = css({ display: "block" })
export const inlineBlock = css({ display: "inline-block" })
export const inline = css({ display: "inline" })

export const absolute = css({ position: "absolute" })
export const fixed = css({ position: "fixed" })
export const left = (unit: SizeUnit) => css({ left: space(unit) })
export const right = (unit: SizeUnit) => css({ right: space(unit) })
export const top = (unit: SizeUnit) => css({ top: space(unit) })
export const bottom = (unit: SizeUnit) => css({ bottom: space(unit) })

export const flex = css({ display: "flex" })
export const flexRow = css({ flexDirection: "row" })
export const flexCol = css({ flexDirection: "column" })

export const maxSizes = {
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

export const maxW = (key: keyof typeof maxSizes) =>
  css({ maxWidth: maxSizes[key] })

export const maxH = (key: keyof typeof maxSizes) =>
  css({ maxWidth: maxSizes[key] })

// typeography
export const textCenter = css({ textAlign: "center" })
export const textLeft = css({ textAlign: "left" })
export const textRight = css({ textAlign: "right" })

export const fontNormal = css({ fontFamily: "Roboto, sans-serif" })
export const fontCondensed = css({
  fontFamily: '"Roboto Condensed", sans-serif',
})

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

// colors
const midnightColors = {
  100: "hsl(212, 42%, 85%)",
  200: "hsl(211, 42%, 75%)",
  300: "hsl(212, 43%, 65%)",
  400: "hsl(211, 42%, 55%)",
  500: "hsl(211, 42%, 45%)",
  600: "hsl(211, 43%, 35%)",
  700: "hsl(211, 42%, 25%)",
  800: "hsl(210, 42%, 18%)",
  900: "hsl(207, 44%, 13%)",
}

export const bgMidnight = (key: keyof typeof midnightColors) =>
  css({ backgroundColor: midnightColors[key] })

export const textMidnight = (key: keyof typeof midnightColors) =>
  css({ color: midnightColors[key] })

export const bgSemiBlack = (opacity: 25 | 50 | 75) =>
  css({ backgroundColor: `rgba(0, 0, 0, 0.${opacity})` })

// effects
export const opacity = (amount: 0 | 25 | 50 | 75 | 100) =>
  css({ opacity: `${amount}%` })

export const transition = (properties = "all") =>
  css({ transition: "0.2s", transitionProperty: properties })

// states
export const hover = (...styles: any[]) =>
  // @ts-ignore fix later
  css({ ":hover": css({}, ...styles) })

export const focus = (...styles: any[]) =>
  // @ts-ignore fix later
  css({ ":focus": css({}, ...styles) })

export const active = (...styles: any[]) =>
  // @ts-ignore fix later
  css({ ":active": css({}, ...styles) })
