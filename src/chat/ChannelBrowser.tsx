import { useRect } from "@reach/rect"
import fuzzysearch from "fuzzysearch"
import sortBy from "lodash/sortBy"
import { observer, useObserver } from "mobx-react-lite"
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import { ChannelListing, ChannelListingType } from "../channel/ChannelStore"
import OverlayCloseButton from "../overlay/OverlayCloseButton"
import OverlayContent from "../overlay/OverlayContent"
import { OverlayPanelHeader } from "../overlay/OverlayPanel"
import OverlayShade from "../overlay/OverlayShade"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import Box, { boxStyle } from "../ui/Box"
import Button from "../ui/Button"
import { fadedRevealStyle } from "../ui/helpers"
import Icon, { IconName } from "../ui/Icon"
import { css, styled } from "../ui/styled"
import TextInput from "../ui/TextInput"
import { gapSizes } from "../ui/theme"

function ChannelBrowser() {
  const { channelStore } = useRootStore()
  useEffect(() => channelStore.requestListings(), [channelStore])

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
              {...searchInput.bind}
            />
            <Button onClick={cycleSortMode}>
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

function Tab(props: ComponentPropsWithoutRef<"button"> & { active?: boolean }) {
  const baseStyle = css`
    ${boxStyle({
      flex: true,
      direction: "row",
      justify: "center",
      pad: gapSizes.small,
      background: props.active ? "theme1" : undefined,
    })};

    /* can't use gap prop :( */
    > * + * {
      margin-left: ${gapSizes.xsmall};
    }

    transition-property: opacity;

    :focus {
      outline: none;
    }
  `

  return (
    <button css={[baseStyle, !props.active && fadedRevealStyle]} {...props} />
  )
}

function useChannelListSorting() {
  type SortMode = {
    icon: IconName
    sortEntries: (entries: ChannelListing[]) => ChannelListing[]
  }

  const sortModes: SortMode[] = [
    {
      icon: "sortAlphabetical",
      sortEntries: (entries) => sortBy(entries, "name"),
    },
    {
      icon: "sortNumeric",
      sortEntries: (entries) => sortBy(entries, "userCount").reverse(),
    },
  ]

  const [sortModeIndex, setSortModeIndex] = useState(0)
  const sortMode = sortModes[sortModeIndex]

  const cycleSortMode = () => {
    setSortModeIndex((index) => (index + 1) % sortModes.length)
  }

  return { sortMode, cycleSortMode }
}

/**
 * Lowercases and removes non-letters,
 * to make more appropriate for fuzzysearching
 */
const queryify = (text: string) => text.replace(/[^a-z]+/gi, "").toLowerCase()
