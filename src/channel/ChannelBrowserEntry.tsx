import { observer } from "mobx-react-lite"
import React from "react"
import { ListChildComponentProps } from "react-window"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import { fadedRevealStyle } from "../ui/helpers"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import { ChannelListing } from "./ChannelStore"

type Props = ListChildComponentProps & {
  entry: ChannelListing
}

function ChannelBrowserEntry({ entry, style }: Props) {
  const { channelStore } = useRootStore()

  const joined = channelStore.isJoined(entry.id)

  const toggleJoin = () => {
    if (joined) {
      channelStore.leave(entry.id)
    } else {
      channelStore.join(entry.id)
    }
  }

  const pad = {
    vertical: spacing.xsmall,
    horizontal: spacing.small,
  }

  return (
    <label key={entry.id} style={style}>
      <Entry height="100%" direction="row" align="center" pad={pad}>
        <EntryInput type="checkbox" checked={joined} onChange={toggleJoin} />
        <Box direction="row" flex align="center" gap={spacing.xsmall}>
          <Icon
            icon={joined ? "checkFilled" : "checkOutline"}
            size={0.8}
            style={{ position: "relative", top: "-1px" }}
          />
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
`
