import React, { ComponentPropsWithoutRef } from "react"

type Props = ComponentPropsWithoutRef<"label"> & {
  labelText: string
}

export default function FormField({ labelText, children, ...props }: Props) {
  return (
    <label {...props} className={`block ${props.className}`}>
      <div className={`block mb-1`}>{labelText}</div>
      {children}
    </label>
  )
}
