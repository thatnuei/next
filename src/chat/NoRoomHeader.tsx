import React from "react"
import { spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import HeaderMenuButton from "./HeaderMenuButton"

function NoRoomHeader() {
  return (
    <Container>
      <HeaderMenuButton />
      <Title>next</Title>
    </Container>
  )
}

export default NoRoomHeader

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.small};
  ${spacedChildrenHorizontal(spacing.small)};
`

const Title = styled.h3`
  opacity: 0.5;
`
