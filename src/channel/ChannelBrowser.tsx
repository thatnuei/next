import { useRect } from "@reach/rect"
import sortBy from "lodash/sortBy"
import { observer } from "mobx-react-lite"
import React, { useRef } from "react"
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
import { styled } from "../ui/styled"
import createTabs from "../ui/tabs"
import TextInput from "../ui/TextInput"
import { spacing } from "../ui/theme"
import ChannelBrowserEntryList from "./ChannelBrowserEntryList"
import { ChannelBrowserSortMode } from "./types"

const { TabProvider, TabContent, TabLink } = createTabs([
  "public",
  "private",
] as const)

function ChannelBrowser() {
  const { channelStore } = useRootStore()

  const listContainerRef = useRef<HTMLDivElement>(null)
  const rect = useRect(listContainerRef) || { width: 0, height: 0 }

  const searchInput = useInput()

  const sortModeCycle = useCycle<ChannelBrowserSortMode>([
    {
      icon: "sortNumeric",
      sortEntries: (entries) => sortBy(entries, "userCount").reverse(),
    },
    {
      icon: "sortAlphabetical",
      sortEntries: (entries) => sortBy(entries, "name"),
    },
  ])
  const sortMode = sortModeCycle.current

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

          <TabProvider>
            <Box direction="row">
              <StyledTabLink tab="public">
                <Icon icon="public" />
                <span>Public</span>
              </StyledTabLink>
              <StyledTabLink tab="private">
                <Icon icon="private" />
                <span>Private</span>
              </StyledTabLink>
            </Box>

            <Box flex ref={listContainerRef}>
              <TabContent tab="public">
                <ChannelBrowserEntryList
                  entries={channelStore.listings.public}
                  {...entryListProps}
                />
              </TabContent>
              <TabContent tab="private">
                <ChannelBrowserEntryList
                  entries={channelStore.listings.private}
                  {...entryListProps}
                />
              </TabContent>
            </Box>
          </TabProvider>

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

const StyledTabLink = styled(TabLink)`
  display: flex;
  flex-direction: row;
  justify-content: center;

  flex: 1;

  padding: ${spacing.small};

  > * + * {
    margin-left: ${spacing.xsmall};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.theme1};
  }

  &:not(.active) {
    ${fadedRevealStyle};
  }
`
