import { useRect } from "@reach/rect"
import fuzzysearch from "fuzzysearch"
import { observer } from "mobx-react-lite"
import React, { useRef, useState } from "react"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import queryify from "../common/queryify"
import OverlayCloseButton from "../overlay/OverlayCloseButton"
import OverlayContent from "../overlay/OverlayContent"
import { OverlayPanelHeader } from "../overlay/OverlayPanel"
import OverlayShade from "../overlay/OverlayShade"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import Box from "../ui/Box"
import Button from "../ui/Button"
import { fadedRevealStyle } from "../ui/helpers"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"
import TextInput from "../ui/TextInput"
import { spacing } from "../ui/theme"
import ChannelBrowserEntry from "./ChannelBrowserEntry"
import { ChannelListingType } from "./ChannelStore"
import useChannelListSorting from "./useChannelListSorting"

function ChannelBrowser() {
  const { channelStore } = useRootStore()

  const listContainerRef = useRef<HTMLDivElement>(null)
  const rect = useRect(listContainerRef) || { width: 0, height: 0 }

  const { sortMode, cycleSortMode } = useChannelListSorting()
  const searchInput = useInput()

  const [listingTab, setListingTab] = useState<ChannelListingType>("public")

  const getTabProps = (type: ChannelListingType) => ({
    active: listingTab === type,
    onClick: () => setListingTab(type),
  })

  const allEntries = channelStore.listings[listingTab]

  const sortedEntries = sortMode.sortEntries(allEntries)

  const displayedEntries = sortedEntries.filter((entry) => {
    return fuzzysearch(queryify(searchInput.value), queryify(entry.name))
  })

  const renderEntry = (props: ListChildComponentProps) => (
    <ChannelBrowserEntry {...props} entry={displayedEntries[props.index]} />
  )

  return (
    <OverlayShade>
      <OverlayContent
        pad={spacing.small}
        justify="center"
        style={{ maxWidth: "500px" }}
      >
        <Box
          background="theme2"
          width="100%"
          height="100%"
          style={{ maxHeight: "800px" }}
          elevated
        >
          <OverlayPanelHeader style={{ position: "relative" }}>
            Channels
            <Box
              justify="center"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: spacing.small,
              }}
            >
              <OverlayCloseButton />
            </Box>
          </OverlayPanelHeader>

          <Box direction="row">
            <Tab {...getTabProps("public")}>
              <Icon icon="public" />
              <span>Public</span>
            </Tab>
            <Tab {...getTabProps("private")}>
              <Icon icon="private" />
              <span>Private</span>
            </Tab>
          </Box>

          <Box flex ref={listContainerRef}>
            <FixedSizeList
              width={rect.width}
              height={rect.height}
              itemCount={displayedEntries.length}
              itemSize={36}
              itemKey={(index) => displayedEntries[index].id}
              children={renderEntry}
              overscanCount={10}
            />
          </Box>

          <Box
            background="theme0"
            direction="row"
            pad={spacing.xsmall}
            gap={spacing.xsmall}
          >
            <TextInput
              style={{ flex: 1 }}
              placeholder="Search..."
              aria-label="Search"
              {...searchInput.bind}
            />
            <Button title="Switch sort mode" onClick={cycleSortMode}>
              <Icon icon={sortMode.icon} />
            </Button>
          </Box>
        </Box>
      </OverlayContent>
    </OverlayShade>
  )
}

export default observer(ChannelBrowser)

const Tab = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;

  flex: 1;

  background-color: ${({ active, theme }) =>
    active ? theme.colors.theme1 : "transparent"};
  padding: ${spacing.small};

  > * + * {
    margin-left: ${spacing.xsmall};
  }

  ${(props) => (props.active ? "" : fadedRevealStyle)};
`
