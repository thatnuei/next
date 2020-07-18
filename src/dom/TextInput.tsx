import React from "react"
import { TagProps } from "../jsx/types"

type Props = { onChangeText?: (text: string) => void } & TagProps<"input">

function TextInput({ onChange, onChangeText, ...props }: Props) {
  return (
    <input
      onChange={(event) => {
        onChange?.(event)
        onChangeText?.(event.target.value)
      }}
      {...props}
    />
  )
}

export default TextInput
