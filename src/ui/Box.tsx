import { css, styled } from "./styled"

type BoxProps = {
  direction?: "row" | "column"
  outerSpacing?: string
  innerSpacing?: string
  wrap?: "wrap" | "nowrap" | "reverse"
}

const defaultSpacing = "1rem"

const resolveInnerSpacing = (props: BoxProps) => {
  const { direction = "column", innerSpacing = defaultSpacing } = props
  if (direction === "row") {
    return css`
      margin-right: ${innerSpacing};
    `
  } else if (direction === "column") {
    return css`
      margin-bottom: ${innerSpacing};
    `
  }
}

export const Box = styled.div<BoxProps>`
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  padding: ${(props) => props.outerSpacing || defaultSpacing};

  & > :not(:last-child) {
    ${resolveInnerSpacing};
  }
`
