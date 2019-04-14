import { Box, Text } from "grommet"
import React, { ComponentPropsWithoutRef } from "react"

type Props = ComponentPropsWithoutRef<"label"> & {
  labelText: string
}

export default function FormField({ labelText, children, ...props }: Props) {
  return (
    <label {...props}>
      <Box margin={{ bottom: "xxsmall" }}>
        <Text>{labelText}</Text>
      </Box>
      {children}
    </label>
  )
}
