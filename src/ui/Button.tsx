import { styled } from "./styled"

export const Button = styled.button`
  font: inherit;
  color: inherit;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 0.7rem;
  transition: 0.2s background-color;
  cursor: pointer;

  :hover {
    background: rgba(0, 0, 0, 0.8);
  }
`
