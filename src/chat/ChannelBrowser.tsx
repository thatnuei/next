import fuzzysearch from "fuzzysearch"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { ChannelListing } from "../channel/ChannelStore"
import OverlayPanel, { OverlayPanelHeader } from "../overlay/OverlayPanel"
import OverlayShade from "../overlay/OverlayShade"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import Box from "../ui/Box"
import Button from "../ui/Button"
import { fadedRevealStyle } from "../ui/helpers"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"
import TextInput from "../ui/TextInput"
import { gapSizes } from "../ui/theme"

function ChannelBrowser() {
  const { channelStore } = useRootStore()
  useEffect(() => channelStore.requestListings(), [channelStore])

  const searchInput = useInput()

  const handleJoin = (entry: ChannelListing) => {
    if (channelStore.isJoined(entry.id)) {
      channelStore.leave(entry.id)
    } else {
      channelStore.join(entry.id)
    }
  }

  const processedEntries = channelStore.listings.public.filter((entry) =>
    fuzzysearch(searchInput.value.toLowerCase(), entry.name.toLowerCase()),
  )

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
          {processedEntries.map((entry) => {
            const joined = channelStore.isJoined(entry.id)
            const onChange = () => handleJoin(entry)

            const pad = {
              vertical: gapSizes.xsmall,
              horizontal: gapSizes.small,
            }

            return (
              <label key={entry.id}>
                <Entry direction="row" align="center" pad={pad}>
                  <EntryInput
                    type="checkbox"
                    checked={joined}
                    onChange={onChange}
                  />
                  <Box
                    direction="row"
                    flex
                    align="center"
                    gap={gapSizes.xsmall}
                  >
                    <Icon
                      icon={joined ? "checkFilled" : "checkOutline"}
                      size={0.8}
                      style={{ position: "relative", top: "-1px" }}
                    />
                    <div style={{ flex: 1, lineHeight: 1 }}>{entry.name}</div>
                    <div>{entry.userCount}</div>
                  </Box>
                </Entry>
              </label>
            )
          })}
        </Box>

        <Box direction="row" pad={gapSizes.xsmall} gap={gapSizes.xsmall}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Search..."
            {...searchInput.bind}
          />
          <Button>
            <Icon icon="sortAlphabetical" />
          </Button>
        </Box>
      </OverlayPanel>
    </OverlayShade>
  )
}

export default observer(ChannelBrowser)

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
