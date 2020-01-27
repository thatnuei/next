import * as bbc from "bbc.js"
import React from "react"
import { inline } from "../ui/helpers.new"
import BBCTree from "./BBCTree"

type Props = {
  text: string
}

function BBC(props: Props) {
  return (
    <div css={[inline, { whiteSpace: "pre-line" }]}>
      <BBCTree key={props.text} nodes={bbc.toTree(props.text)} />
    </div>
  )
}

export default React.memo(BBC)
