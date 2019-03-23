import React, { ComponentPropsWithoutRef } from "react"
import { styled } from "./styled"

type Props = ComponentPropsWithoutRef<"label"> & {
  labelText: string
}

export default function FormField({ labelText, children, ...props }: Props) {
  return (
    <label {...props}>
      <LabelText>{labelText}</LabelText>
      {children}
    </label>
  )
}

const LabelText = styled.div`
  margin-bottom: 2px;
`
