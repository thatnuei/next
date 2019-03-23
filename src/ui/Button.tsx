import { shade } from "polished"
import { primaryColor, semiBlack } from "./colors"
import { styled } from "./styled"

const Button = styled.button`
  padding: 0.4rem 0.7rem;
  background-color: ${primaryColor};
  box-shadow: 0px 4px 6px ${semiBlack(0.2)};
  transition: 0.2s;
  transition-property: background-color;

  :hover {
    background-color: ${shade(0.2, primaryColor)};
  }
`

Button.defaultProps = {
  type: "button",
}

export default Button
