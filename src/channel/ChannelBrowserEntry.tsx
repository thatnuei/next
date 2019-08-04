import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { ListChildComponentProps } from "react-window"
import { useRootStore } from "../RootStore"
import useAsync from "../state/useAsync"
import Box from "../ui/Box"
import { fadedRevealStyle } from "../ui/helpers"
import Icon from "../ui/Icon"
import LoadingIcon from "../ui/LoadingIcon"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import { ChannelListing } from "./ChannelStore"

type Props = ListChildComponentProps & {
  entry: ChannelListing
}

function ChannelBrowserEntry({ entry, style }: Props) {
  const { channelStore, chatNavigationStore } = useRootStore()
  const async = useAsync()

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

  const toggleJoin = async () => {
    if (joined) {
      await channelStore.leave(entry.id)
    } else {
      await channelStore.join(entry.id)
    }
  }

  const pad = {
    vertical: spacing.xsmall,
    horizontal: spacing.small,
  }

  return (
    // this shouldn't use a checkbox
    // would be easier to have a button with role="checkbox"
    <label key={entry.id} style={style}>
      <Entry height="100%" direction="row" align="center" pad={pad}>
        <EntryInput
          type="checkbox"
          checked={joined}
          onChange={async.bind(toggleJoin)}
          disabled={async.loading}
        />

        <Box direction="row" flex align="center" gap={spacing.xsmall}>
          {async.loading ? (
            <LoadingIcon size={0.9} />
          ) : (
            <Icon
              icon={joined ? "checkFilled" : "checkOutline"}
              size={0.9}
              style={{ position: "relative", top: "-1px" }}
            />
          )}

          <div
            style={{ flex: 1, lineHeight: 1 }}
            dangerouslySetInnerHTML={{ __html: entry.name }}
          />
          <div>{entry.userCount}</div>
        </Box>
      </Entry>
    </label>
  )
}

export default observer(ChannelBrowserEntry)

const Entry = styled(Box)`
  ${fadedRevealStyle};
  opacity: 0.7;
  cursor: pointer;

  :focus-within {
    opacity: 1;
  }
`

const EntryInput = styled.input`
  position: absolute;
  opacity: 0;

  &:checked + * {
    color: ${(props) => props.theme.colors.success};
  }

  &:disabled + * {
    opacity: 0.5;
    pointer-events: none;
  }
`
