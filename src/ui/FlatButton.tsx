import { semiBlack } from "./colors"
import { styled } from "./styled"

const FlatButton = styled.button`
  padding: 0.4rem 0.7rem;
  background-color: transparent;
  transition: 0.2s;
  transition-property: background-color, transform;

  :hover,
  :focus {
    background-color: ${semiBlack(0.3)};
    outline: none;
  }

  :active {
    transition-duration: 0s;
    transform: translateY(3px);
  }
`

FlatButton.defaultProps = {
  type: "button",
}

export default FlatButton
