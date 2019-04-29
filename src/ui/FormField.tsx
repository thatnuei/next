import React, { ComponentPropsWithoutRef } from "react"
import Box from "./Box"
import { gapSizes } from "./theme.new"

type Props = ComponentPropsWithoutRef<"label"> & {
  labelText: string
}

export default function FormField({ labelText, children, ...props }: Props) {
  return (
    <label {...props}>
      <Box margin={{ bottom: gapSizes.xxsmall }}>{labelText}</Box>
      {children}
    </label>
  )
}
