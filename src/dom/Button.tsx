import React from "react"
import { TagProps } from "../jsx/types"

/** Regular DOM button with a better default type */
function Button(props: TagProps<"button">) {
  return <button type="button" {...props} />
}

export default Button
