import { styled } from "../styled"
import Button from "./Button"

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
