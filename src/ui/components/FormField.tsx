import React, { ComponentPropsWithoutRef } from "react"
import { block, mb } from "../helpers.new"

type Props = ComponentPropsWithoutRef<"label"> & {
  labelText: string
}

export default function FormField({ labelText, children, ...props }: Props) {
  return (
    <label css={block} {...props}>
      <div css={[block, mb(1)]}>{labelText}</div>
      {children}
    </label>
  )
}
