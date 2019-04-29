import { styled } from "./styled"
import { gapSizes } from "./theme.new"

const Button = styled.button`
  padding: ${gapSizes.xsmall} ${gapSizes.small};
  background-color: rgba(0, 0, 0, 0.3);
  transition: 0.2s background-color;
  cursor: pointer;

  :hover,
  :focus {
    background-color: rgba(0, 0, 0, 0.6);
    outline: none;
  }
`

Button.defaultProps = {
  type: "button",
}

export default Button
