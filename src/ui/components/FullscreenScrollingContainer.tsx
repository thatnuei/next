import { cover } from "polished"
import React from "react"
import { scrollVertical } from "../helpers"
import { styled } from "../styled"

const FullscreenScrollingContainer = (props: { children: React.ReactNode }) => (
  <Outer>
    <Inner>{props.children}</Inner>
  </Outer>
)
export default FullscreenScrollingContainer

const Outer = styled.div`
  ${cover()};
  ${scrollVertical};
`

const Inner = styled.div`
  min-height: 100%;
  padding: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;
`
