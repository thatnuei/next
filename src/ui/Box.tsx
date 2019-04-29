import {} from "polished"
import React, { ComponentPropsWithoutRef } from "react"
import { styled } from "./styled"
import { AppThemeColor, gapSizes } from "./theme"

type BoxProps = {
  as?: React.ElementType
  width?: number | string
  height?: number | string
  background?: AppThemeColor
  elevated?: boolean
  direction?: "row" | "column"
  align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline"
  alignContent?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline"
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly"
  flex?: boolean | number
  flexGrow?: number
  flexShrink?: number
  basis?: string | number
  pad?: string | number | PadObject
  margin?: any // TODO

  /**
   * @example
   * gap={4}      // specify gap size in pixels
   * gap="0.5rem" // specify css unit
   * gap          // shorthand, use default gap
   */
  gap?: number | string | boolean

  overflow?: any // TODO (also add translateZ(0))
}

type PadObject = {
  left?: string | number
  right?: string | number
  top?: string | number
  bottom?: string | number
  vertical?: string | number
  horizontal?: string | number
}

const Box = (
  { gap, children, ...props }: ComponentPropsWithoutRef<"div"> & BoxProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  let elements: React.ReactNode[] = []

  const gapUnit = resolveGapUnit(gap)
  if (gapUnit === "0") {
    elements = [children]
  } else {
    const childrenArray = React.Children.toArray(children)
    for (let i = 0; i < childrenArray.length - 1; i++) {
      elements.push(childrenArray[i], <BoxGap size={gapUnit} />)
    }
    elements.push(childrenArray[childrenArray.length - 1])
  }

  return (
    <BoxElement {...props} ref={ref}>
      {elements}
    </BoxElement>
  )
}

export default React.forwardRef(Box)

const defaultGap = gapSizes.small

const resolveUnit = (value: number | string | undefined) => {
  if (typeof value === "number") return `${value}px`
  return value
}

const resolveFlex = (value: BoxProps["flex"]) => {
  if (value === true) return 1
  if (typeof value === "number") return value
  return undefined
}

const resolveGapUnit = (value: BoxProps["gap"]) => {
  if (value == null || value === false) return "0"
  if (value === true) return defaultGap
  return resolveUnit(value)! // already checked for undefined
}

const resolvePad = (value: BoxProps["pad"]) => {
  if (value == null) return ""

  if (typeof value === "string" || typeof value === "number") {
    return `padding: ${resolveUnit(value)}`
  }

  const left = resolveUnit(value.horizontal || value.left)
  const right = resolveUnit(value.horizontal || value.right)
  const top = resolveUnit(value.vertical || value.top)
  const bottom = resolveUnit(value.vertical || value.bottom)

  return `
    padding-left: ${left};
    padding-right: ${right};
    padding-top: ${top};
    padding-bottom: ${bottom};
  `
}

const BoxElement = styled.div<BoxProps>`
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  width: ${(props) => resolveUnit(props.width)};
  height: ${(props) => resolveUnit(props.height)};
  ${(props) => resolvePad(props.pad)};
  background-color: ${(props) =>
    props.background ? props.theme.colors[props.background] : "transparent"};
  box-shadow: ${(props) => props.elevated && `0px 4px 8px rgba(0, 0, 0, 0.3)`};
  justify-content: ${(props) => props.justify};
  align-items: ${(props) => props.align};
  align-content: ${(props) => props.alignContent};
  flex: ${(props) => resolveFlex(props.flex)};
  flex-grow: ${(props) => props.flexGrow};
  flex-shrink: ${(props) => props.flexShrink};
  flex-basis: ${(props) => resolveUnit(props.basis)};
`

const BoxGap = styled.div<{ size: string }>`
  flex: 0 0 auto;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`
