import { useRect } from "@reach/rect"
import fuzzysearch from "fuzzysearch"
import sortBy from "lodash/sortBy"
import { observer, useObserver } from "mobx-react-lite"
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
import Icon, { IconName } from "../ui/Icon"
import { styled } from "../ui/styled"
import TextInput from "../ui/TextInput"
import { gapSizes } from "../ui/theme"
import { ChannelListing, ChannelListingType } from "./ChannelStore"

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
        pad={gapSizes.small}
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
                right: gapSizes.small,
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
            pad={gapSizes.xsmall}
            gap={gapSizes.xsmall}
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

function ChannelBrowserEntry({
  entry,
  style,
}: ListChildComponentProps & { entry: ChannelListing }) {
  const { channelStore } = useRootStore()

  return useObserver(() => {
    const joined = channelStore.isJoined(entry.id)

    const toggleJoin = () => {
      if (joined) {
        channelStore.leave(entry.id)
      } else {
        channelStore.join(entry.id)
      }
    }

    const pad = {
      vertical: gapSizes.xsmall,
      horizontal: gapSizes.small,
    }

    return (
      <label key={entry.id} style={style}>
        <Entry height="100%" direction="row" align="center" pad={pad}>
          <EntryInput type="checkbox" checked={joined} onChange={toggleJoin} />
          <Box direction="row" flex align="center" gap={gapSizes.xsmall}>
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
  })
}

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

const Tab = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;

  flex: 1;

  background-color: ${({ active, theme }) =>
    active ? theme.colors.theme1 : "transparent"};
  padding: ${gapSizes.small};

  > * + * {
    margin-left: ${gapSizes.xsmall};
  }

  ${(props) => (props.active ? "" : fadedRevealStyle)};
`

function useChannelListSorting() {
  type SortMode = {
    icon: IconName
    sortEntries: (entries: ChannelListing[]) => ChannelListing[]
  }

  const sortModes: SortMode[] = [
    {
      icon: "sortNumeric",
      sortEntries: (entries) => sortBy(entries, "userCount").reverse(),
    },
    {
      icon: "sortAlphabetical",
      sortEntries: (entries) => sortBy(entries, "name"),
    },
  ]

  const [sortModeIndex, setSortModeIndex] = useState(0)
  const sortMode = sortModes[sortModeIndex]

  const cycleSortMode = () => {
    setSortModeIndex((index) => (index + 1) % sortModes.length)
  }

  return { sortMode, cycleSortMode }
}
