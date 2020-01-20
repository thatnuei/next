import React, { ComponentPropsWithoutRef } from "react"
import inputBase, { inputFocus } from "../inputBase"
import { styled } from "../styled"

type Props = ComponentPropsWithoutRef<"input"> & {
  onTextChange?: (text: string) => void
}

export default function TextInput({ onChange, onTextChange, ...props }: Props) {
  return (
    <StyledInput
      {...props}
      onChange={(event) => {
        onChange?.(event)
        onTextChange?.(event.target.value)
      }}
    />
  )
}

const StyledInput = styled.input`
  ${inputBase};
  ${inputFocus};
`
