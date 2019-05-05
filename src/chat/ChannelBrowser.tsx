import fuzzysearch from "fuzzysearch"
import sortBy from "lodash/sortBy"
import { observer } from "mobx-react-lite"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ChannelListing } from "../channel/ChannelStore"
import { useOverlay } from "../overlay/OverlayContext"
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
  const searchInput = useInput()
  const overlay = useOverlay()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => channelStore.requestListings(), [channelStore])

  useLayoutEffect(() => {
    if (overlay.isVisible && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [overlay.isVisible])

  const [sortMode, setSortMode] = useState<"alpha" | "userCount">("userCount")

  const entries = channelStore.listings.public

  const sortedEntries =
    sortMode === "alpha"
      ? sortBy(entries, "name")
      : sortBy(entries, "userCount").reverse()

  const processedEntries = sortedEntries.filter((entry) =>
    fuzzysearch(searchInput.value.toLowerCase(), entry.name.toLowerCase()),
  )

  const toggleSortMode = () => {
    setSortMode((mode) => (mode === "alpha" ? "userCount" : "alpha"))
  }

  const handleJoin = (entry: ChannelListing) => {
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
            ref={searchInputRef}
            {...searchInput.bind}
          />
          <Button onClick={toggleSortMode}>
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
