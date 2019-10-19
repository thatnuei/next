import React, { ComponentPropsWithoutRef } from "react"
import { styled } from "../styled"
import { spacing } from "../theme"

type Props = ComponentPropsWithoutRef<"label"> & {
  labelText: string
}

export default function FormField({ labelText, children, ...props }: Props) {
  return (
    <Label {...props}>
      <LabelText>{labelText}</LabelText>
      {children}
    </Label>
  )
}

const LabelText = styled.div`
  margin-bottom: ${spacing.xsmall};
`

const Label = styled.label`
  display: block;
  width: 100%;
`
