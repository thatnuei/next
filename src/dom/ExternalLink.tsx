import React from "react"
import { TagProps } from "../jsx/types"

export default function ExternalLink(props: TagProps<"a">) {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a target="_blank" rel="noopener noreferrer" {...props} />
}
