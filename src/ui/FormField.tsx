import React, { ComponentPropsWithoutRef } from "react"
import Box from "./Box"
import { spacing } from "./theme"

type Props = ComponentPropsWithoutRef<"label"> & {
  labelText: string
}

export default function FormField({ labelText, children, ...props }: Props) {
  return (
    <label {...props}>
      <Box margin={{ bottom: spacing.xxsmall }}>{labelText}</Box>
      {children}
    </label>
  )
}
