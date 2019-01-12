import { css, styled } from "./styled"

type ButtonProps = {
  flat?: boolean
}

const flatStyle = css`
  background: none;
  opacity: 0.5;

  :hover,
  :focus {
    background: none;
    opacity: 1;
  }
`

export const Button = styled.button<ButtonProps>`
  font: inherit;
  color: inherit;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 0.7rem;
  transition: 0.2s;
  transition-property: background-color, opacity;
  cursor: pointer;

  :hover,
  :focus {
    background: rgba(0, 0, 0, 0.8);
  }

  ${(props) => props.flat && flatStyle};
`
