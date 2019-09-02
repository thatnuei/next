import { css } from "./styled"

type GridProps = {
  templateColumns?: string
  templateRows?: string
  autoColumns?: string
  autoRows?: string
  autoFlow?: "row" | "column"
  gap?: string
  rowGap?: string
  columnGap?: string
}

export const grid = (props: GridProps) => css`
  display: grid;
  grid-template-columns: ${props.templateColumns};
  grid-template-rows: ${props.templateRows};
  grid-auto-rows: ${props.autoRows};
  grid-auto-columns: ${props.autoColumns};
  grid-auto-flow: ${props.autoFlow};
  grid-gap: ${props.gap};
  grid-row-gap: ${props.rowGap};
  grid-column-gap: ${props.columnGap};
`
