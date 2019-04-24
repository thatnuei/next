import { textColor } from "./colors"
import { styled } from "./styled"

const Anchor = styled.a`
  opacity: 0.7;
  transition: 0.2s opacity;
  border-bottom: 1px solid ${textColor};
  display: inline-block;
  line-height: 1;
  padding-bottom: 3px;

  :hover,
  :focus {
    opacity: 1;
    cursor: pointer;
  }
`
export default Anchor
