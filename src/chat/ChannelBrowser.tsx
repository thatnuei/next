import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { ChannelListing } from "../channel/ChannelStore"
import OverlayPanel, { OverlayPanelHeader } from "../overlay/OverlayPanel"
import OverlayShade from "../overlay/OverlayShade"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import Button from "../ui/Button"
import { fadedRevealStyle } from "../ui/helpers"
import Icon from "../ui/Icon"
import { css, styled } from "../ui/styled"
import TextInput from "../ui/TextInput"
import { gapSizes } from "../ui/theme"

function ChannelBrowser() {
  const { channelStore } = useRootStore()

  useEffect(() => channelStore.requestListings(), [channelStore])

  const handleEntryClick = (entry: ChannelListing) => {
    if (channelStore.isJoined(entry.id)) {
      channelStore.leave(entry.id)
    } else {
      channelStore.join(entry.id)
    }
  }

  return (
    <OverlayShade>
      <OverlayPanel maxWidth="500px">
        <OverlayPanelHeader>Channels</OverlayPanelHeader>

        <Box
          width="100%"
          height="100%"
          flex
          overflowY="auto"
          background="theme2"
        >
          {channelStore.listings.public.map((entry) => (
            <Entry
              key={entry.id}
              joined={channelStore.isJoined(entry.id)}
              onClick={() => handleEntryClick(entry)}
            >
              <span>{entry.name}</span>
              <span>{entry.userCount}</span>
            </Entry>
          ))}
        </Box>

        <Box direction="row" pad={gapSizes.xsmall} gap={gapSizes.xsmall}>
          <TextInput style={{ flex: 1 }} placeholder="Search..." />
          <Button>
            <Icon icon="sortAlphabetical" />
          </Button>
        </Box>
      </OverlayPanel>
    </OverlayShade>
  )
}

export default observer(ChannelBrowser)

const Entry = styled.button<{ joined?: boolean }>`
  padding: ${gapSizes.xsmall} ${gapSizes.small};

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${(props) => (props.joined ? joinedStyle : fadedRevealStyle)}
`

const joinedStyle = css`
  background-color: ${(props) => props.theme.colors.theme1};
`
