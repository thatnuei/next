import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { ListChildComponentProps } from "react-window"
import { useRootStore } from "../RootStore"
import useAsync from "../state/useAsync"
import { fadedRevealStyle, spacedChildrenHorizontal } from "../ui/helpers"
import Icon from "../ui/Icon"
import LoadingIcon from "../ui/LoadingIcon"
import { styled } from "../ui/styled"
import { spacing, useTheme } from "../ui/theme"
import { ChannelListing } from "./ChannelStore"

type Props = ListChildComponentProps & {
  entry: ChannelListing
}

function ChannelBrowserEntry({ entry, ...props }: Props) {
  const { channelStore, chatNavigationStore } = useRootStore()
  const async = useAsync()
  const theme = useTheme()

  const joined = chatNavigationStore.hasTab({
    type: "channel",
    channelId: entry.id,
  })

  useEffect(() => {
    if (async.error) {
      // TODO: show toast
      alert(async.error)
    }
  }, [async.error])

  const toggleJoin = async (event: React.MouseEvent) => {
    event.preventDefault()

    if (joined) {
      await channelStore.leave(entry.id)
    } else {
      await channelStore.join(entry.id)
    }
  }

  const style = {
    ...props.style,
    color: joined ? theme.colors.success : theme.colors.text,
  }

  return (
    <Container
      href="#"
      role="checkbox"
      aria-checked={joined}
      style={style}
      css={joined ? undefined : fadedRevealStyle}
      onClick={async.bind(toggleJoin)}
    >
      {async.loading ? (
        <LoadingIcon size={0.9} />
      ) : (
        <Icon icon={joined ? "checkFilled" : "checkOutline"} size={0.9} />
      )}

      <TitleText dangerouslySetInnerHTML={{ __html: entry.name }} />
      <div>{entry.userCount}</div>
    </Container>
  )
}

export default observer(ChannelBrowserEntry)

const Container = styled.a`
  display: flex;
  align-items: center;
  padding: 0 ${spacing.xsmall};
  ${spacedChildrenHorizontal(spacing.xsmall)};
`

const TitleText = styled.div`
  flex: 1;
`
