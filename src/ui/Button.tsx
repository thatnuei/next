import { shade } from "polished"
import React from "react"
import { themeColor } from "./colors"
import { css } from "./styled"

type ButtonProps = React.ComponentProps<"button"> & {
  flat?: boolean
}

const Button = ({ flat, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      css={[buttonStyle, flat && buttonFlatStyle]}
      {...props}
    />
  )
}

export default Button

export const buttonStyle = css`
  background-color: ${shade(0.3, themeColor)};
  padding: 0.5rem 0.7rem;
  transition: 0.2s;
  transition-property: background-color;
  cursor: pointer;

  :hover {
    background-color: ${shade(0.6, themeColor)};
  }

  :focus {
    outline: 2px solid rgba(255, 255, 255, 0.15);
  }
`

export const buttonFlatStyle = css`
  background-color: ${themeColor};

  :hover {
    background-color: ${shade(0.3, themeColor)};
  }
`
