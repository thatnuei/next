import React from "react"
import { styled } from "../../ui/styled"
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
`

const Title = styled.h2`
  opacity: 0.5;
`