import React from "react"
import { useSelector, useStore } from "../store/hooks"
import { getChannel, isChannelJoined } from "../store/selectors"
import Icon, { IconName } from "../ui/components/Icon"
import LoadingIcon from "../ui/components/LoadingIcon"
import { fillArea, spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import { ChannelBrowserEntry } from "./types"

type Props = {
  entry: ChannelBrowserEntry
  icon: IconName
}

export default function ChannelBrowserListItem({ entry, icon }: Props) {
  const channel = useSelector(getChannel(entry.id))
  const isJoined = useSelector(isChannelJoined(entry.id))
  const isLoading = channel.entryAction != null
  const { actions } = useStore()

  const handleClick = () => {
    if (isJoined) {
      actions.channel.leaveChannel(entry.id)
    } else {
      actions.channel.joinChannel(entry.id)
    }
  }

  return (
    <Container
      active={isJoined}
      disabled={isLoading}
      onClick={handleClick}
      role="checkbox"
      aria-checked={isJoined}
    >
      {isLoading ? <LoadingIcon /> : <Icon icon={icon} />}
      <Title dangerouslySetInnerHTML={{ __html: entry.title }} />
      <UserCount>{entry.userCount}</UserCount>
    </Container>
  )
}

const Container = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: ${spacing.xsmall};
  ${spacedChildrenHorizontal(spacing.xsmall)};
  ${fillArea};

  ${(props) =>
    props.active
      ? { backgroundColor: props.theme.colors.theme0 }
      : { opacity: 0.7 }}

  ${(props) => props.disabled && { opacity: 0.4, pointerEvents: "none" }}
`

const Title = styled.div`
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const UserCount = styled.div``
