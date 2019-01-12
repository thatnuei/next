import React from "react"
import { styled } from "./styled"

interface Props extends React.HTMLAttributes<HTMLElement> {
  labelText?: string
  htmlFor?: string
}

export class FormField extends React.Component<Props> {
  render() {
    const { labelText, htmlFor, children, ...props } = this.props
    return (
      <Container {...props}>
        {labelText ? <Label htmlFor={htmlFor}>{labelText}</Label> : null}
        {children}
      </Container>
    )
  }
}

const Container = styled.div`
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
`
