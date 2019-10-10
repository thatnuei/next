import { observer } from "mobx-react-lite"
import React from "react"
import SidebarMenuButton from "../chat/components/SidebarMenuButton"
import { flexRow, spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor, spacing } from "../ui/theme"
import ChannelModel from "./ChannelModel"

type Props = { channel: ChannelModel }

function ChannelHeader({ channel }: Props) {
  return (
    <Container>
      <SidebarMenuButton />
      <Title>{channel.name}</Title>
    </Container>
  )
}

export default observer(ChannelHeader)

const Container = styled.header`
  background-color: ${getThemeColor("theme0")};

  ${flexRow};
  align-items: center;

  padding: ${spacing.small};
  ${spacedChildrenHorizontal(spacing.small)};
`

const Title = styled.h2`
  flex: 1;
`
