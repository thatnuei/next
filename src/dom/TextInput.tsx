import type { ComponentProps } from "react"
import { autoRef } from "../react/autoRef"

type Props = {
  onChangeText?: (text: string) => void
  // ref?: Ref<HTMLInputElement>
} & ComponentProps<"input">

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

export default autoRef<Props, HTMLInputElement>(TextInput)
