import { css } from "./styled"

export const fullscreen = css`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

export const fullHeight = css`
  height: 100%;
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
