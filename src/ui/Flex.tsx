import { styled } from "./styled"

type FlexProps = {
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

const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  flex-wrap: ${(props) => props.wrap};
`

export default Flex

type FlexChildProps = {
  flex?: number | string
  grow?: number | string
  shrink?: number | string
  basis?: number | string
}

export const FlexChild = styled.div<FlexChildProps>`
  flex: ${(props) => props.flex};
  flex-grow: ${(props) => props.grow};
  flex-shrink: ${(props) => props.shrink};
  flex-basis: ${(props) => props.basis};
`
