import React from "react"
import { mb, w } from "./style"

type Props = React.ComponentPropsWithoutRef<"label"> & {
  labelText: string
  children: React.ReactNode
}

function FormField({ labelText, children, ...props }: Props) {
  return (
    <label {...props}>
      <div>{labelText}</div>
      {children}
    </label>
  )
}

export default FormField
