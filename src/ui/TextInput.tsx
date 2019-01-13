import { styled } from "./styled"

const TextInput = styled.input`
  font: inherit;
  color: inherit;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 0.7rem;
  transition: 0.2s background-color;

  display: block;
  width: 100%;

  :focus {
    background: rgba(0, 0, 0, 0.8);
  }
`
export default TextInput
