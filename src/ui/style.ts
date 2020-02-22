import { css } from "@emotion/react"
import { CSSInterpolation } from "@emotion/serialize/types"
import { AppTheme, BackgroundColorKey } from "./theme"

type FlexAlign = "flex-start" | "flex-end" | "center" | "stretch"

type FlexJustify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"

type LengthUnit = number | "full" | StringAutocompleteHack

type StringAutocompleteHack = string & { __autocompleteHack?: never }

export const len = (units: LengthUnit) => {
  if (typeof units === "number") return `${units * 0.25}rem`
  if (units === "full") return "100%"
  return units
}

// layout
export const w = (units: LengthUnit) => css({ width: len(units) })
export const h = (units: LengthUnit) => css({ height: len(units) })
export const size = (units: LengthUnit) => [w(units), h(units)]
export const maxW = (units: LengthUnit) => css({ maxWidth: len(units) })
export const maxH = (units: LengthUnit) => css({ maxHeight: len(units) })
export const maxSize = (units: LengthUnit) => [maxW(units), maxH(units)]
export const minW = (units: LengthUnit) => css({ minWidth: len(units) })
export const minH = (units: LengthUnit) => css({ minHeight: len(units) })
export const minSize = (units: LengthUnit) => [minW(units), minH(units)]

export const p = (units: LengthUnit) => css({ padding: len(units) })
export const pt = (units: LengthUnit) => css({ paddingTop: len(units) })
export const pb = (units: LengthUnit) => css({ paddingBottom: len(units) })
export const pl = (units: LengthUnit) => css({ paddingLeft: len(units) })
export const pr = (units: LengthUnit) => css({ paddingRight: len(units) })
export const px = (units: LengthUnit) => [pl(units), pr(units)]
export const py = (units: LengthUnit) => [pt(units), pb(units)]

export const m = (units: LengthUnit) => css({ margin: len(units) })
export const mt = (units: LengthUnit) => css({ marginTop: len(units) })
export const mb = (units: LengthUnit) => css({ marginBottom: len(units) })
export const ml = (units: LengthUnit) => css({ marginLeft: len(units) })
export const mr = (units: LengthUnit) => css({ marginRight: len(units) })
export const mx = (units: LengthUnit) => [ml(units), mr(units)]
export const my = (units: LengthUnit) => [mt(units), mb(units)]

export const hidden = css({ display: "none" })
export const block = css({ display: "block" })
export const inline = css({ display: "inline" })
export const inlineBlock = css({ display: "inline-block" })

export const flexRow = css({ display: "flex" })
export const flexColumn = css({ display: "flex", flexDirection: "column" })
export const flex1 = css({ flex: 1 })
export const flexBasis = (units: LengthUnit) => css({ flexBasis: len(units) })

export const alignItems = (alignItems: FlexAlign) => css({ alignItems })
export const alignContent = (alignContent: FlexAlign) => css({ alignContent })
export const justifyContent = (justifyContent: FlexJustify) =>
  css({ justifyContent })
export const flexCenter = [alignItems("center"), justifyContent("center")]

export const absolute = css({ position: "absolute" })
export const relative = css({ position: "relative" })
export const fixed = css({ position: "fixed" })

export const left = (units: LengthUnit) => css({ left: len(units) })
export const right = (units: LengthUnit) => css({ right: len(units) })
export const top = (units: LengthUnit) => css({ top: len(units) })
export const bottom = (units: LengthUnit) => css({ bottom: len(units) })

export const absoluteFill = [absolute, size("full")]

export const fixedCover = css({
  position: "fixed",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
})

export const scrollVertical = css({ overflowY: "auto" })

// colors
export const themeBgColor = (key: BackgroundColorKey) => (theme: AppTheme) =>
  css({ backgroundColor: theme.colors.background[key] })

export const themeTextColor = (theme: AppTheme) =>
  css({ color: theme.colors.text })

export const semiBlackBg = (opacity: number) =>
  css({ background: `rgba(0, 0, 0, ${opacity})` })

// typeography
const fontSizeMap = {
  small: "0.85rem",
  normal: "1rem",
  large: "1.5rem",
  xlarge: "2rem",
}

export const fontSize = (key: keyof typeof fontSizeMap) =>
  css({ fontSize: fontSizeMap[key] })

export const fontLightCondensed = css({
  fontFamily: '"Roboto Condensed", sans-serif',
  fontWeight: 300,
})

export const textCenter = css({ textAlign: "center" })
export const textLeft = css({ textAlign: "left" })
export const textRight = css({ textAlign: "right" })

export const underline = css({ textDecoration: "underline" })
export const strikethrough = css({ textDecoration: "line-through" })
export const bold = css({ fontWeight: 500 })
export const italic = css({ fontStyle: "italic" })

export const leadingNone = css({ lineHeight: 1 })

export const ellipsize = css({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
})

// effects
export const opacity = (opacity: number) => css({ opacity })

export const transition = (properties?: string) =>
  css({ transitionDuration: "0.2s", transitionProperty: properties })

export const rounded = css({ borderRadius: len(1) })

export const themeShadow = (theme: AppTheme) =>
  css({ boxShadow: theme.shadow.normal })

export const themeShadowInner = (theme: AppTheme) =>
  css({ boxShadow: theme.shadow.inner })

export const outlineNone = css({ outline: "none" })

// states
export const hover = (...styles: CSSInterpolation[]) =>
  css({ ":hover": styles as any })

export const focus = (...styles: CSSInterpolation[]) =>
  css({ ":focus": styles as any })

export const active = (...styles: CSSInterpolation[]) =>
  css({ ":active": styles as any })

export const disabled = (...styles: CSSInterpolation[]) =>
  css({ ":disabled": styles as any })

// responsive
export const media = (query: string) => (...styles: CSSInterpolation[]) => css`
  @media ${query} {
    ${styles}
  }
`

export const screenQueries = {
  small: "(min-width: 0) and (max-width: 767px)",
  medium: "(min-width: 768px) and (max-width: 1023px)",
  large: "(min-width: 1024px)",
}

export const smallScreen = media(screenQueries.small)
export const mediumScreen = media(screenQueries.medium)
export const largeScreen = media(screenQueries.large)
