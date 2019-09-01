import { observer } from "mobx-react-lite"
import React from "react"
import ChatMenuButton from "../chat/ChatMenuButton"
import FadedButton from "../ui/FadedButton"
import {
  flexColumn,
  flexRow,
  spacedChildrenHorizontal,
  spacedChildrenVertical,
} from "../ui/helpers"
import Icon, { IconName, IconProps } from "../ui/Icon"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import useMedia from "../ui/useMedia"
import ChannelFilters from "./ChannelFilters"
import ChannelModel from "./ChannelModel"

type Props = {
  channel: ChannelModel
  userListButton: React.ReactNode
  onToggleDescription: () => void
}

function ChannelHeader({ channel, ...props }: Props) {
  const iconProps: IconProps = channel.isPublic
    ? { icon: "public", title: "Public room" }
    : { icon: "lock", title: "Private room" }

  return (
    <Container>
      <ChatMenuButton />

      <TitleAndActionsContainer>
        <TitleRow>
          <h3>{channel.name}</h3>
          <Icon {...iconProps} size={0.9} faded />
        </TitleRow>
        <ActionsRow>
          <ActionButton
            icon="about"
            text="Description"
            onClick={props.onToggleDescription}
          />
          {/* <ActionButton icon="pencilSquare" text="Manage" />
          <ActionButton icon="warning" text="Report" />
          <ActionButton icon="envelope" text="Invite" /> */}
        </ActionsRow>
      </TitleAndActionsContainer>

      <ChannelFilters channel={channel} />

      {props.userListButton}
    </Container>
  )
}

export default observer(ChannelHeader)

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.theme0};

  ${flexRow};
  align-items: center;

  padding: ${spacing.small};
  ${spacedChildrenHorizontal(spacing.small)};
`

const TitleAndActionsContainer = styled.div`
  flex: 1;
  ${flexColumn};
  justify-content: center;
  ${spacedChildrenVertical(spacing.xsmall)};
`

const TitleRow = styled.div`
  ${flexRow};
  ${spacedChildrenHorizontal(spacing.xsmall)};
`

const ActionsRow = styled.div`
  display: flex;
  flex-flow: row wrap;

  > * {
    margin-right: ${spacing.small};
  }
`

function ActionButton(props: {
  text: string
  icon: IconName
  onClick: () => void
}) {
  const showText = useMedia("(min-width: 600px)")
  return (
    <ActionButtonContainer
      title={showText ? undefined : props.text}
      onClick={props.onClick}
    >
      <Icon icon={props.icon} size={0.8} />
      {showText ? <span>{props.text}</span> : null}
    </ActionButtonContainer>
  )
}

const ActionButtonContainer = styled(FadedButton)`
  ${flexRow};
  ${spacedChildrenHorizontal(spacing.xxsmall)};
  align-items: center;
  font-size: 90%;
`
