import { observer } from "mobx-react-lite"
import React from "react"
import Button from "../ui/components/Button"
import Icon from "../ui/components/Icon"
import LoadingIcon from "../ui/components/LoadingIcon"
import TextInput from "../ui/components/TextInput"
import VirtualizedList from "../ui/components/VirtualizedList"
import {
  fillArea,
  flexColumn,
  flexGrow,
  flexRow,
  spacedChildrenHorizontal,
} from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor, spacing } from "../ui/theme"
import useRootStore from "../useRootStore"
import ChannelBrowserListItem from "./ChannelBrowserListItem"

function ChannelBrowser() {
  const { channelBrowserStore } = useRootStore()

  const sortButtonIcon =
    channelBrowserStore.sortMode === "title"
      ? "sortAlphabetical"
      : "sortNumeric"

  const refreshIcon = channelBrowserStore.isRefreshing ? (
    <LoadingIcon />
  ) : (
    <Icon icon="refresh" />
  )

  return (
    <Container>
      <ChannelListContainer>
        <VirtualizedList
          items={channelBrowserStore.displayedEntries}
          itemHeight={40}
          getItemKey={(item) => item.id}
          renderItem={(entry) => <ChannelBrowserListItem entry={entry} />}
        />
      </ChannelListContainer>

      <Footer>
        <TextInput
          placeholder="Search..."
          value={channelBrowserStore.searchQuery}
          onChange={(event) =>
            channelBrowserStore.setSearchQuery(event.target.value)
          }
        />
        <Button onClick={channelBrowserStore.cycleSortMode}>
          <Icon icon={sortButtonIcon} />
        </Button>
        <Button
          onClick={channelBrowserStore.refresh}
          disabled={channelBrowserStore.isRefreshing}
        >
          {refreshIcon}
        </Button>
      </Footer>
    </Container>
  )
}

export default observer(ChannelBrowser)

const Container = styled.div`
  ${fillArea};
  ${flexColumn};
  background-color: ${getThemeColor("theme2")};
`

const ChannelListContainer = styled.div`
  ${flexGrow};
`

const Footer = styled.div`
  padding: ${spacing.xsmall};
  ${flexRow};
  ${spacedChildrenHorizontal(spacing.xsmall)};
  background-color: ${getThemeColor("theme0")};
`
