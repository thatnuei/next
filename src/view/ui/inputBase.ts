import { semiBlack } from "./colors"
import { css } from "./styled"

const inputBase = css`
  font: inherit;
  color: inherit;
  border: none;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.5rem 0.7rem;
  transition: 0.2s background-color;
  box-shadow: 0px 0px 3px ${semiBlack(0.3)} inset;

  display: block;
  width: 100%;

  :hover {
    background: rgba(0, 0, 0, 0.55);
  }
`
export default inputBase

export const inputFocus = css`
  :focus {
    background: rgba(0, 0, 0, 0.7);
  }
`
