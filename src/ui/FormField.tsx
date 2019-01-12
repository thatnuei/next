import React from "react"
import { css } from "./styled"

interface Props extends React.HTMLAttributes<HTMLElement> {
  labelText?: string
  htmlFor?: string
}

export default class FormField extends React.Component<Props> {
  render() {
    const { labelText, htmlFor, children, ...props } = this.props
    return (
      <div css={{ marginBottom: "1rem" }} {...props}>
        {labelText ? (
          <label css={labelStyle} htmlFor={htmlFor}>
            {labelText}
          </label>
        ) : null}
        {children}
      </div>
    )
  }
}

const labelStyle = css`
  display: block;
  margin-bottom: 0.25rem;
`
