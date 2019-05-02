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

export const flexWrap = css`
  flex-wrap: wrap;
`

export const fillArea = css`
  width: 100%;
  height: 100%;
`

export const scrollVertical = css`
  overflow-y: auto;
  transform: translateZ(0);
`

export const boxShadow = css`
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.5);
`

export const fadedRevealStyle = css`
  transition: 0.2s;
  opacity: 0.4;

  :hover,
  :focus {
    opacity: 0.9;
    outline: none;
  }
`
export const pressEffect = css`
  :active {
    transform: translateY(2px);
    transition: none;
  }
`
