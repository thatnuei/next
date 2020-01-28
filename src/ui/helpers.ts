import { css } from "./styled"
import { spacing } from "./theme"

export const fullscreen = css`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const flexRow = css`
  display: flex;
`

export const flexColumn = css`
  display: flex;
  flex-flow: column;
`

export const flexGrow = css`
  flex: 1;
  min-height: 0;
`

export const fillArea = css`
  width: 100%;
  height: 100%;
`

export const scrollVertical = css`
  overflow-y: auto;
  transform: translateZ(0);
`

export const fadedRevealStyle = css`
  transition: 0.2s;
  opacity: 0.4;

  :hover {
    opacity: 0.9;
  }
`

export const spacedChildrenVertical = (distance = spacing.small) => css`
  > * + * {
    margin-top: ${distance};
  }
`

export const spacedChildrenHorizontal = (distance = spacing.small) => css`
  > * + * {
    margin-left: ${distance};
  }
`
