import { observer } from "mobx-react-lite"
import React from "react"
import Icon from "../ui/components/Icon"
import LoadingIcon from "../ui/components/LoadingIcon"
import { fillArea, spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import useRootStore from "../useRootStore"
import { ChannelBrowserEntry } from "./ChannelBrowserStore"

type Props = {
  entry: ChannelBrowserEntry
}

function ChannelBrowserListItem({ entry }: Props) {
  const { channelStore } = useRootStore()
  const channel = channelStore.channels.get(entry.id)
  const isLoading = channel.isLoading

  const handleClick = () => {
    if (channel.isJoined) {
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
      active={channel.isJoined}
      disabled={isLoading}
      onClick={handleClick}
      role="checkbox"
      aria-checked={channel.isJoined}
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
