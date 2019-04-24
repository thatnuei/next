import { styled } from "./styled"

const Anchor = styled.a`
  display: inline-block;

  /* hover reveal reansition */
  opacity: 0.8;
  transition: 0.2s opacity;
  :hover,
  :focus {
    opacity: 1;
    cursor: pointer;
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
