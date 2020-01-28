import React, { ComponentPropsWithoutRef } from "react"

/**
 * Normal button but with a better default type,
 * so it doesn't accidentally trigger form submit.
 * Use this over a normal button whenever possible
 */
export default function Button(props: ComponentPropsWithoutRef<"button">) {
  return <button type="button" {...props} />
}
