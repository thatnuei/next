import {} from "polished"
import React, { ComponentPropsWithoutRef } from "react"
import { css, styled } from "../styled"
import { AppThemeColor, spacing } from "../theme"

export type BoxProps = ComponentPropsWithoutRef<"div"> & {
  as?: React.ElementType
  width?: number | string
  height?: number | string
  background?: AppThemeColor
  elevated?: boolean
  direction?: "row" | "column"
  align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline"
  alignContent?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline"
  alignSelf?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline"
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

  overflowX?: "auto" | "scroll" | "hidden"
  overflowY?: "auto" | "scroll" | "hidden"
}

export type PadObject = {
  left?: string | number
  right?: string | number
  top?: string | number
  bottom?: string | number
  vertical?: string | number
  horizontal?: string | number
}

const Box = (
  { gap, children, ...props }: BoxProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const getChildElements = () => {
    const gapUnit = resolveGapUnit(gap)
    if (gapUnit === "0") return children

    const elements: React.ReactNode[] = []

    const childrenArray = React.Children.toArray(children)
    for (let i = 0; i < childrenArray.length - 1; i++) {
      elements.push(
        childrenArray[i],
        <BoxGap size={gapUnit} key={`gap-${i}`} />,
      )
    }

    elements.push(childrenArray[childrenArray.length - 1])

    return elements
  }

  return (
    <div {...props} css={boxStyle(props)} ref={ref}>
      {getChildElements()}
    </div>
  )
}

export default React.forwardRef(Box)

const defaultGap = spacing.small

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

export const boxStyle = (props: BoxProps) => css`
  display: flex;
  flex-direction: ${props.direction || "column"};
  width: ${resolveUnit(props.width)};
  height: ${resolveUnit(props.height)};
  ${resolvePad(props.pad)};
  background-color: ${({ theme }) =>
    props.background && theme.colors[props.background]};
  box-shadow: ${props.elevated && `0px 4px 8px rgba(0, 0, 0, 0.3)`};
  justify-content: ${props.justify};
  align-items: ${props.align};
  align-content: ${props.alignContent};
  align-self: ${props.alignSelf};
  flex: ${resolveFlex(props.flex)};
  flex-grow: ${props.flexGrow};
  flex-shrink: ${props.flexShrink};
  flex-basis: ${resolveUnit(props.basis)};
  overflow-x: ${props.overflowX};
  overflow-y: ${props.overflowY};
  ${(props.overflowX || props.overflowY) && "transform: translateZ(0)"};

  ${(props.flex || props.flexGrow) && "min-width: 0"};
  ${(props.flex || props.flexGrow) && "min-height: 0"};
`

const BoxGap = styled.div<{ size: string }>`
  flex: 0 0 auto;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`