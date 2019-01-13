import React from "react"
import { css } from "./styled"

type ButtonProps = React.ComponentProps<"button"> & {
  flat?: boolean
}

const Button = ({ flat, ...props }: ButtonProps) => {
  return <button type="button" css={[buttonStyle, flat && flatStyle]} {...props} />
}

export default Button

const buttonStyle = css`
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
`

const flatStyle = css`
  background: none;
  opacity: 0.5;

  :hover,
  :focus {
    background: none;
    opacity: 1;
  }
`
