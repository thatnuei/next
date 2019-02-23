import { styled } from "./styled"

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

const prop = <O extends object, P extends keyof O>(prop: P) => (props: O) =>
  props[prop]

const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${prop("templateColumns")};
  grid-template-rows: ${prop("templateRows")};
  grid-auto-rows: ${prop("autoRows")};
  grid-auto-columns: ${prop("autoColumns")};
  grid-auto-flow: ${prop("autoFlow")};
  grid-gap: ${prop("gap")};
  grid-row-gap: ${prop("rowGap")};
  grid-column-gap: ${prop("columnGap")};
`

export default Grid

// const GridCell = styled.div``
