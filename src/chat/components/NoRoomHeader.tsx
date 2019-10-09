import React from "react"
import { spacedChildrenHorizontal } from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import SidebarMenuButton from "./SidebarMenuButton"

type Props = {}

function NoRoomHeader(props: Props) {
  return <Container>
    <SidebarMenuButton />
    <Title>next</Title>
  </Container>
}

export default NoRoomHeader

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.small};
  ${spacedChildrenHorizontal(spacing.small)};
`

const Title = styled.h2`
  opacity: 0.5;
`