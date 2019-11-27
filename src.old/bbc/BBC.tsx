import * as bbc from "bbc.js"
import React from "react"
import { styled } from "../ui/styled"
import BBCTree from "./BBCTree"

type Props = {
  text: string
}

function BBC(props: Props) {
  return (
    <Container>
      <BBCTree key={props.text} nodes={bbc.toTree(props.text)} />
    </Container>
  )
}

export default React.memo(BBC)

const Container = styled.span`
  white-space: pre-line;
`
