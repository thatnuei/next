import { observer } from "mobx-react-lite"
import React from "react"
import Icon from "../ui/components/Icon"
import LoadingIcon from "../ui/components/LoadingIcon"
import { fillArea, spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import { ChannelBrowserEntry } from "./ChannelBrowserStore"
import { ChannelStore } from "./ChannelStore"

type Props = {
  entry: ChannelBrowserEntry
  channelStore: ChannelStore
}

function ChannelBrowserListItem({ entry, channelStore }: Props) {
  const isJoined = channelStore.isJoined(entry.id)
  const isLoading = false //channel.isLoading

  const handleClick = () => {
    if (isJoined) {
      channelStore.leave(entry.id)
    } else {
      channelStore.join(entry.id)
    }
  }

  const icon = isLoading ? (
    <LoadingIcon />
  ) : (
    <Icon name={entry.type === "public" ? "public" : "lock"} />
  )

  return (
    <Container
      active={isJoined}
      disabled={isLoading}
      onClick={handleClick}
      role="checkbox"
      aria-checked={isJoined}
    >
      {icon}
      <Title dangerouslySetInnerHTML={{ __html: entry.title }} />
      <UserCount>{entry.userCount}</UserCount>
    </Container>
  )
}

export default observer(ChannelBrowserListItem)

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
