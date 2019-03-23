import { semiBlack } from "./colors"
import { styled } from "./styled"

const TextInput = styled.input`
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

  :focus {
    background: rgba(0, 0, 0, 0.7);
    outline: none;
  }
`
export default TextInput
