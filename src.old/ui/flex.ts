import { css } from "./styled"

type FlexOptions = {
  direction?: "column" | "row" | "column-reverse" | "row-reverse"
  alignItems?: "center" | "flex-start" | "flex-end"
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
  wrap?: "wrap" | "nowrap"
}

export const flex = (props: FlexOptions) => css`
  display: flex;
  flex-direction: ${props.direction};
  align-items: ${props.alignItems};
  justify-content: ${props.justifyContent};
  flex-wrap: ${props.wrap};
`

type FlexChildProps = {
  flex?: number | string
  grow?: number | string
  shrink?: number | string
  basis?: number | string
}

export const flexChild = (props: FlexChildProps) => css`
  flex: ${props.flex};
  flex-grow: ${props.grow};
  flex-shrink: ${props.shrink};
  flex-basis: ${props.basis};
`
