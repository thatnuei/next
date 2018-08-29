import React from "react"
import { styled } from "./styled"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string
}

export class TextInput extends React.Component<Props> {
  private labelId = String(Math.random())

  render() {
    const { labelText, ...props } = this.props
    return (
      <div>
        {labelText ? <Label htmlFor={this.labelId}>{labelText}</Label> : null}
        <Input id={this.labelId} {...props} />
      </div>
    )
  }
}

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
`

const Input = styled.input`
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
