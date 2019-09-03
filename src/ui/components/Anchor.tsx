import { styled } from "../styled"

const Anchor = styled.a`
  display: inline-block;
  cursor: pointer;

  /* hover reveal reansition */
  opacity: 0.8;
  transition: 0.2s opacity;
  :hover {
    opacity: 1;
  }

  /* white underline */
  position: relative;
  ::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1px;
    border-bottom: 1px solid currentColor;
  }
`
export default Anchor
