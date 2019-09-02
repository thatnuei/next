import React, { ComponentPropsWithoutRef } from "react"
import Box from "./Box"
import { styled } from "./styled"
import { spacing } from "./theme"

type Props = ComponentPropsWithoutRef<"label"> & {
  labelText: string
}

export default function FormField({ labelText, children, ...props }: Props) {
  return (
    <Label {...props}>
      <Box margin={{ bottom: spacing.xxsmall }}>{labelText}</Box>
      {children}
    </Label>
  )
}

const Label = styled.label`
  display: block;
  width: 100%;
`
