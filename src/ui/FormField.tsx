import React from "react"
import { block, mb, w } from "./style"

type Props = React.ComponentPropsWithoutRef<"label"> & {
  labelText: string
  children: React.ReactNode
}

function FormField({ labelText, children, ...props }: Props) {
  return (
    <label css={[w("full"), block]} {...props}>
      <div css={mb(1)}>{labelText}</div>
      {children}
    </label>
  )
}

export default FormField
