import React, { ComponentPropsWithoutRef } from "react"
import { css } from "./styled"

type Props = ComponentPropsWithoutRef<"label"> & {
  labelText?: string
  htmlFor?: string
}

export default class FormField extends React.Component<Props> {
  render() {
    const { labelText, htmlFor, children, ...props } = this.props
    return (
      <label {...props}>
        <div>{labelText}</div>
        {children}
      </label>
      // <div css={containerStyle} {...props}>
      //   {labelText ? (
      //     <label css={labelStyle} htmlFor={htmlFor}>
      //       {labelText}
      //     </label>
      //   ) : null}
      //   {children}
      // </div>
    )
  }
}

const containerStyle = css``

const labelStyle = css`
  display: block;
  margin-bottom: 0.25rem;
`
