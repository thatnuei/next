import * as bbc from "bbc.js"
import React, { Fragment } from "react"
import BBCTagNode from "./BBCTagNode"

export default function BBCTree({ nodes }: { nodes: bbc.Node[] }) {
  return nodes.map((node, index) =>
    node.type === "text" ? (
      <span key={index} dangerouslySetInnerHTML={{ __html: node.text }} />
    ) : (
      <Fragment key={index}>
        <BBCTagNode node={node} />
      </Fragment>
    ),
  ) as any
}
