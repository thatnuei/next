import Button from "./Button"
import { styled } from "./styled"

const FlatButton = styled(Button)`
  padding: 0;

  &,
  &:hover {
    background: transparent;
  }
`

FlatButton.defaultProps = {
  type: "button",
}

export default FlatButton
