import React, { ComponentPropsWithoutRef } from "react"

type Props = ComponentPropsWithoutRef<"input"> & {
  onTextChange?: (text: string) => void
}

export default function TextInput({ onChange, onTextChange, ...props }: Props) {
  return (
    <input
      {...props}
      onChange={(event) => {
        onChange?.(event)
        onTextChange?.(event.target.value)
      }}
    />
  )
}
