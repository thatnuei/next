import { observer } from "mobx-react-lite"
import React from "react"
import SidebarMenuButton from "../chat/components/SidebarMenuButton"
import FadedButton from "../ui/components/FadedButton"
import Icon from "../ui/components/Icon"
import { flexRow, spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor, spacing } from "../ui/theme"
import useRootStore from "../useRootStore"
import ChannelModel from "./ChannelModel"

type Props = { channel: ChannelModel }

function ChannelHeader({ channel }: Props) {
  const root = useRootStore()
  return (
    <Container>
      <SidebarMenuButton />
      <TitleText>{channel.name}</TitleText>
      <FadedButton onClick={root.chatOverlayStore.channelMenu.show}>
        <Icon icon="more" />
      </FadedButton>
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

const TitleText = styled.h3`
  flex: 1;
`
