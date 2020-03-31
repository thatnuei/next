import React from "react"
import { createBbcTree } from "./helpers"

type Props = { text: string }

function BBC({ text }: Props) {
  const tree = createBbcTree(text)
  return null
}

export default React.memo(BBC)
