import { observer } from "mobx-react-lite"
import React from "react"
import SidebarMenuButton from "../chat/components/SidebarMenuButton"
import useMedia from "../dom/hooks/useMedia"
import FadedButton from "../ui/components/FadedButton"
import Icon from "../ui/components/Icon"
import {
  flexColumn,
  flexRow,
  spacedChildrenHorizontal,
  spacedChildrenVertical,
} from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor, spacing } from "../ui/theme"
import useRootStore from "../useRootStore"
import ChannelModel from "./ChannelModel"
import { userListBreakpoint } from "./constants"

type Props = {
  channel: ChannelModel
  onShowDescription: () => void
}

function ChannelHeader({ channel, onShowDescription }: Props) {
  const root = useRootStore()
  const isChannelMenuHidden = useMedia(`(max-width: ${userListBreakpoint}px)`)

  return (
    <Container>
      <SidebarMenuButton />

      <MiddleSection>
        <TitleText>{channel.name}</TitleText>
        <FadedButton onClick={onShowDescription}>
          <span>Description</span>
          <Icon icon="about" size={0.8} />
        </FadedButton>
      </MiddleSection>

      {isChannelMenuHidden && (
        <FadedButton
          onClick={() => root.channelStore.showChannelMenu(channel.id)}
        >
          <Icon icon="more" />
        </FadedButton>
      )}
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

const MiddleSection = styled.div`
  flex: 1;
  ${flexColumn};
  ${spacedChildrenVertical(spacing.xxsmall)};
`

const TitleText = styled.h3`
  flex: 1;
`
