import { useRect } from "@reach/rect"
import sortBy from "lodash/sortBy"
import { observer } from "mobx-react-lite"
import React, { useRef } from "react"
import { Tab, TabList, TabPanel, useTabState } from "reakit/Tab"
import OverlayCloseButton from "../overlay/OverlayCloseButton"
import OverlayContent from "../overlay/OverlayContent"
import { OverlayPanelHeader } from "../overlay/OverlayPanel"
import OverlayShade from "../overlay/OverlayShade"
import { useRootStore } from "../RootStore"
import useCycle from "../state/useCycle"
import useInput from "../state/useInput"
import Box from "../ui/Box"
import Button from "../ui/Button"
import { fadedRevealStyle } from "../ui/helpers"
import Icon from "../ui/Icon"
import { css, styled } from "../ui/styled"
import TextInput from "../ui/TextInput"
import { spacing } from "../ui/theme"
import ChannelBrowserEntryList from "./ChannelBrowserEntryList"
import { ChannelBrowserSortMode } from "./types"

const sortModes: ChannelBrowserSortMode[] = [
  {
    icon: "sortNumeric",
    sortEntries: (entries) => sortBy(entries, "userCount").reverse(),
  },
  {
    icon: "sortAlphabetical",
    sortEntries: (entries) => sortBy(entries, "name"),
  },
]

function ChannelBrowser() {
  const { channelStore } = useRootStore()

  const listContainerRef = useRef<HTMLDivElement>(null)
  const rect = useRect(listContainerRef) || { width: 0, height: 0 }

  const searchInput = useInput()

  const sortModeCycle = useCycle<ChannelBrowserSortMode>(sortModes)
  const sortMode = sortModeCycle.current

  const tab = useTabState({
    currentId: "public",
  })

  const entryListProps = {
    listHeight: rect.height,
    searchValue: searchInput.value,
    sortMode,
  }

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

          <Box
            as={TabList}
            {...tab}
            aria-label="Public / Private channel tabs"
            direction="row"
          >
            <StyledTab {...tab} stopId="public">
              <Icon icon="public" />
              <span>Public</span>
            </StyledTab>
            <StyledTab {...tab} stopId="private">
              <Icon icon="private" />
              <span>Private</span>
            </StyledTab>
          </Box>

          <Box flex ref={listContainerRef}>
            <StyledTabPanel {...tab} stopId="public">
              <ChannelBrowserEntryList
                entries={channelStore.listings.public}
                {...entryListProps}
              />
            </StyledTabPanel>
            <StyledTabPanel {...tab} stopId="private">
              <ChannelBrowserEntryList
                entries={channelStore.listings.private}
                {...entryListProps}
              />
            </StyledTabPanel>
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
            <Button title="Switch sort mode" onClick={sortModeCycle.next}>
              <Icon icon={sortMode.icon} />
            </Button>
          </Box>
        </Box>
      </OverlayContent>
    </OverlayShade>
  )
}

export default observer(ChannelBrowser)

const StyledTabPanel = styled(TabPanel)`
  flex: 1;
`

const StyledTab = styled(Tab)`
  display: flex;
  flex-direction: row;
  justify-content: center;

  flex: 1;

  padding: ${spacing.small};

  > * + * {
    margin-left: ${spacing.xsmall};
  }

  ${(props) =>
    props.stopId === props.currentId ? activeTabStyle : fadedRevealStyle};
`

const activeTabStyle = css`
  background-color: ${(props) => props.theme.colors.theme1};
`
